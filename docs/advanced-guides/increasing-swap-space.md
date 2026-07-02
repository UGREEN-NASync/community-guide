# Increasing Swap Space on a UGREEN NAS

This guide walks you through adding extra swap space to a UGREEN NAS running UGOS. It covers diagnosing low swap space, creating an extra swapfile, and making it survive reboots.

**Who this is for:** Anyone running a UGREEN NAS with many Docker containers who is seeing containers crash on startup, restart loops, or a sluggish system — especially on an 8 GB model. You do not need deep Linux knowledge to follow this guide, but you will be running commands as root, so read each step before you run it.

> [!WARNING]
> The commands in this guide run as **root** — the most privileged user on the system. A mistake (wrong path, wrong size, wrong file) can overwrite or delete data, corrupt the OS, or render the NAS unbootable. There is no undo. Read each command carefully before you run it, and do not copy-paste commands you do not understand.

**What this does:** It creates a large file on your NAS's internal NVMe drive and tells the operating system to use it as overflow memory (swap). This gives processes more room to breathe when RAM fills up, which stops the OS from killing containers mid-start.

**Risks and limitations:**

- **This is not a substitute for more RAM.** Swap is much slower than RAM. Adding swap buys time and stability; it does not make your NAS faster. If your system is permanently maxing out swap, the real solution is fewer containers or a model with more RAM.
- **You are running commands as root.** A typo in the wrong place can delete data or break your system. Double-check every command before pressing Enter.
- **The swapfile will occupy space on your system NVMe.** A 16 GB swapfile on a 107 GB `/overlay` partition is fine; check your available space before sizing.
- **UGOS-specific behaviour:** UGOS ships with [earlyoom](https://github.com/rfjakob/earlyoom), a daemon that kills processes before the kernel's own out-of-memory killer fires. This is why crashing containers show exit code 137 but `OOMKilled: false` — earlyoom kills them outside of Docker's awareness. Increasing swap gives earlyoom enough headroom to stop firing.

> [!NOTE]
> This guide was written and tested on a **UGREEN DXP4800 Plus with 8 GB of RAM** running UGOS. The symptoms, partition layout, and earlyoom behaviour described here should apply to other UGREEN NAS models, but exact partition names, sizes, and software versions may differ slightly on your device.

---

## Background

When your NAS runs out of RAM, the operating system uses **swap** as an overflow area — it moves some of the data in RAM to disk temporarily to make room. UGREEN NAS devices come with two sources of swap pre-configured:

- **zram** — a compressed area carved out of RAM itself. It's fast but limited, because it still depends on how much RAM you have free.
- **A swap partition** on the internal NVMe drive (the fast solid-state storage inside the NAS, typically identified as `nvme2n1p5`).

Together these give around 10 GB of swap out of the box. On an 8 GB NAS running 40–60 Docker containers, that 10 GB fills up within days or weeks as containers load their data. Once swap is nearly full, the system has nowhere left to put overflow data, and it starts **killing processes before they can finish starting up**.

---

## Symptoms

- **A container keeps crashing and restarting** — if you run `docker inspect <container>` you'll see **exit code 137** and `OOMKilled: false`. Exit code 137 means the process was forcibly killed; `OOMKilled: false` is Docker saying it didn't do the killing (something else did — more on this below).
- **Container logs cut off mid-startup** — the container got killed before it finished initialising, so the log just stops.
- **The system feels sluggish or unresponsive**, even for simple operations.
- `free -h` shows swap nearly or completely full.

Run `free -h` to check your memory and swap usage:

```bash
free -h
```

```
               total        used        free      shared  buff/cache   available
Mem:            7.5Gi       6.1Gi       432Mi       282Mi       1.9Gi       1.3Gi
Swap:           9.8Gi       9.7Gi       100Mi
```

In this example, 9.7 GB of 9.8 GB swap is used — only 100 MB remains. That's the problem.

You can also check `vmstat` to see if the system is constantly shuffling data between RAM and swap (called **thrashing** — like a desk so cluttered you spend more time moving papers around than actually working):

```bash
vmstat 1 3
```

Watch the `si` and `so` columns (swap-in and swap-out). If those numbers are large and constant across all three readings, the system is thrashing.

---

## Why OOMKilled is false

UGOS includes a program called [earlyoom](https://github.com/rfjakob/earlyoom) that runs quietly in the background. Its job is to watch memory usage and, when things get critically low, kill whichever process is using the most memory — _before_ the system becomes completely unresponsive.

The problem is that earlyoom kills processes directly, without going through Docker. Docker never finds out what happened, so it reports `OOMKilled: false` even though the container was definitely killed due to memory pressure. The exit code 137 is the clue — it means "killed by an external signal".

earlyoom is also configured with thresholds: it starts killing when free swap drops below 20% of total. On a 10 GB swap setup, that's 2 GB — and if your system is at 97% usage, it's been below that threshold the entire time. Every new container that tries to start gets killed almost immediately.

Check that earlyoom is running and see its configuration:

```bash
# Is earlyoom running?
pgrep -a earlyoom
```

```bash
# What are its thresholds?
# -m 5      = kill when available memory < 5%
# -M 65536  = kill when available memory < 64 MiB
# -s 20     = kill when swap free < 20%
cat /etc/default/earlyoom
```

```bash
# See which processes earlyoom has recently killed
grep earlyoom /var/log/syslog | grep SIGKILL | tail -10
```

### Confirming earlyoom is the culprit

These two commands show you where memory is going. Run them to see which containers are using the most RAM, and which processes have been pushed out to swap:

```bash
# How much RAM each container is using
docker stats --no-stream --format 'table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}' \
  | sort -k3 -nr
```

```bash
# Which processes have been pushed out to swap (largest first)
for pid in $(ls /proc | grep -E '^[0-9]+$'); do
  swap=$(awk '/VmSwap/{print $2}' /proc/$pid/status 2>/dev/null)
  comm=$(cat /proc/$pid/comm 2>/dev/null)
  [ -n "$swap" ] && echo "$swap $comm $pid"
done | sort -rn | head -20
```

---

## Where to put the swapfile

First, get a picture of your storage layout:

```bash
lsblk
df -h
```

On a UGREEN NAS, the internal NVMe drive (`nvme2n1`) has a large partition mounted at `/overlay` — typically 100+ GB, usually less than 30% used. This is the right place for the swapfile because NVMe storage is fast enough for swap to be useful.

**Do not put the swapfile on:**

- `/volume1` or your HDD storage array — hard drives are far too slow for swap. If the system tries to use HDD-based swap under pressure, it will become _more_ unresponsive, not less.
- A network share (NFS, SMB) — network latency makes this even worse.
- A BTRFS or ZFS volume — these filesystems need extra configuration to support swapfiles.

Check how much space is available on `/overlay` before deciding on a size:

```bash
df -h /overlay
```

Leave at least 50% of the partition free after creating the swapfile. For example: a 16 GB swapfile on a 107 GB `/overlay` partition that already has 23 GB used leaves 68 GB free — that's fine.

---

## Creating the swapfile

Run these five commands in order. Each one is explained below.

```bash
# 1. Create a 16 GB file that will be used as swap
#    (Change 16G to your preferred size — see the sizing table below)
sudo fallocate -l 16G /overlay/swapfile

# 2. Restrict who can read it — Linux requires this before it will use the file as swap
sudo chmod 600 /overlay/swapfile

# 3. Mark the file as swap space
sudo mkswap /overlay/swapfile

# 4. Start using it now (this will not survive a reboot — the next section covers that)
sudo swapon /overlay/swapfile

# 5. Confirm it is active
free -h
sudo swapon --show
```

After step 5, `free -h` should show a noticeably larger swap total, and `swapon --show` should list `/overlay/swapfile`.

---

## Making it persistent across reboots — use a polling systemd unit, not fstab

The swapfile you created above is active right now, but it will disappear after a reboot. You need to tell UGOS to re-enable it automatically on every startup.

The obvious ways to do this don't work on UGOS due to a boot-ordering issue:

- **Adding it to `/etc/fstab`** (the standard Linux way to mount things at startup) fails because UGOS activates swap before the `/overlay` partition has finished mounting. The swap command runs too early, fails silently, and never retries.
- **Standard systemd swap configuration** has the same problem — it also fires too early in the boot sequence.

The reliable fix is a small background service that **waits and watches** until `/overlay` is ready, then enables the swapfile. It checks every two seconds and only proceeds once the partition is confirmed mounted — sidestepping the timing problem entirely.

```bash
sudo tee /etc/systemd/system/overlay-swapfile.service << 'EOF'
[Unit]
Description=Activate swapfile on /overlay

[Service]
Type=oneshot
TimeoutStartSec=300
ExecStart=/bin/sh -c 'until mountpoint -q /overlay; do sleep 2; done; grep -q /overlay/swapfile /proc/swaps || /sbin/swapon /overlay/swapfile'
ExecStop=/sbin/swapoff /overlay/swapfile
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now overlay-swapfile.service
```

Verify it is active and enabled:

```bash
systemctl status overlay-swapfile.service
free -h
```

The service waits up to five minutes for `/overlay` to become available (it normally appears within 30 seconds of boot). Once ready, it enables the swapfile. If `/overlay` never mounts for some reason, the service gives up and reports a failure — it does not block the rest of the system from starting.

---

## Verifying earlyoom backs off

Recall that earlyoom kills processes when free swap drops below 20% of total. With 16 GB of extra swap added, your total swap is now around 26 GB — which means earlyoom's kill threshold is roughly 5 GB of free swap. Under normal load you should have well over that, giving every container room to start without being killed.

Run these commands to confirm things have settled down:

```bash
free -h
grep earlyoom /var/log/syslog | grep -v 'fre:\|Fre:' | tail -5
```

The first command should show plenty of free swap. The second shows the last few earlyoom log entries — if it has stopped reporting kills, you have enough headroom.

---

## Reverting

```bash
# Stop and disable the service
sudo systemctl disable --now overlay-swapfile.service

# Remove the unit file
sudo rm /etc/systemd/system/overlay-swapfile.service
sudo systemctl daemon-reload

# Delete the swapfile
sudo rm /overlay/swapfile
```

---

## Sizing guidelines

| RAM   | Containers | Extra swap to add |
| ----- | ---------- | ----------------- |
| 8 GB  | 20–40      | 8–16 GB           |
| 8 GB  | 40–60+     | 16–24 GB          |
| 16 GB | 40–60      | 8 GB              |
| 16 GB | 60+        | 16 GB             |

A quick way to check if your size is sufficient: earlyoom will start killing processes when free swap drops below 20% of the total. So if your total swap after adding the swapfile is 26 GB, the kill threshold is ~5 GB free. Make sure your normal day-to-day swap usage leaves more than that free.

Adding swap extends your runway, it doesn't fix the root cause. If swap is perpetually full no matter how much you add, the underlying problem is simply too many containers for the amount of RAM in your device — the only real fix is fewer containers or a NAS with more RAM.

---

## Further reading

- [earlyoom](https://github.com/rfjakob/earlyoom)
- [`man swapon(8)`](https://man7.org/linux/man-pages/man8/swapon.8.html)
- [`man systemd.swap(5)`](https://www.freedesktop.org/software/systemd/man/systemd.swap.html)

::: info Credit
This guide was created by [sliekens](https://github.com/sliekens)
:::
