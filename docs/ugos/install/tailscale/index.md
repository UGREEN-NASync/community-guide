# Setting up tailscale for external access

## Instructions

### Step 1: Log in via SSH

Open a terminal and connect to your NAS over SSH:

```sh
ssh USERNAME@IP
```

Use your account password when prompted.

---

### Step 2: Install Tailscale

Install Tailscale using the official install script:

```sh
curl -fsSL https://tailscale.com/install.sh | sh
```

---

### Step 3: Start Tailscale

Run the following command to start Tailscale and authenticate your device:

```sh
sudo tailscale up
```

You’ll be given a URL to visit in your browser. Follow the link and log into your Tailscale account to connect the device.

---

### Step 4: Fix DNS override issue (optional but recommended)

Some users have reported that after starting Tailscale, their NAS cannot reach the internet. This is due to Tailscale overriding `/etc/resolv.conf`, which UGOS relies on for DNS resolution.

To avoid this issue, disable Tailscale's DNS handling:

```sh
sudo tailscale down
sudo tailscale up --accept-dns=false
```

---

## Making Tailscale persist after reboot and system updates

By default, Tailscale on UGOS does not retain custom flags or behavior after a reboot or system update. To make sure Tailscale continues to work across reboots, including any advanced options (like subnet routing), you can create a systemd override.

### Step 1: Create a systemd override file

```sh
sudo mkdir -p /etc/systemd/system/tailscaled.service.d
sudo nano /etc/systemd/system/tailscaled.service.d/override.conf
```

Paste the following into the file:

```ini
[Service]
ExecStart=
ExecStart=/usr/sbin/tailscaled --state=/var/lib/tailscale/tailscaled.state --tun=userspace-networking
```

Save and exit (`Ctrl+O`, `Enter`, then `Ctrl+X`).

---

### Step 2: Reload systemd and enable the service

```sh
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable tailscaled
sudo systemctl restart tailscaled
```

After this, Tailscale will start automatically with your settings every time the system boots.

---

## Advertising a subnet or VLAN

If you want to access other devices on your network through Tailscale by their local IP addresses (such as through a VLAN or LAN subnet), you can advertise that subnet so other devices in your Tailscale network can route traffic through your NAS.

Replace the subnet below with your actual network range:

```sh
sudo tailscale up --advertise-routes=192.168.100.0/24 --accept-routes --accept-dns=false
```

Then approve the advertised route in the Tailscale admin panel under **Machines → Routes**.

---

::: info Credit
This guide was originally created by [RealMrCr4cker](https://www.reddit.com/user/RealMrCr4cker/) ([Github repo](https://github.com/ln-12/UGOS_scripts/)) and expanded by [spamsgood](https://github.com/spamsgood). It is licensed under the MIT Licence.
:::
