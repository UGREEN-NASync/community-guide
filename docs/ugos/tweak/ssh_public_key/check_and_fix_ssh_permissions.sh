#!/bin/bash

# Enforce SSH permissions for a UGOS user (home dir, ~/.ssh, authorized_keys).
#
# Why this exists: UGOS Pro resets these permissions on reboots and on
# configuration changes made through the web UI, which silently breaks
# public-key authentication (permissions observed on a fresh device:
# /home/<user> = 777).
#
# ---------------------------------------------------------------------------
# BUG IN THE PREVIOUS VERSION OF THIS SCRIPT (fixed here, measured on a real
# UGOS Pro device — DXP6800 Pro, firmware 1.17.x, 2026-09-16):
#
#   The old version relied on inotify:
#       while inotifywait -e attrib "$HOME_DIR" "$SSH_DIR" "$AUTHORIZED_KEYS"; do
#           set_permissions
#       done
#   started from a service running <script> <user> with `inotifywait -qq`.
#
#   With `-qq` in monitor mode (-m), inotifywait prints NO event lines at all:
#   quiet levels suppress the event stream itself, not just the startup banner.
#   A `while read`/`while inotifywait` loop fed by it therefore never executes a
#   single iteration. Observed behaviour: the systemd unit reports `active`
#   forever while doing absolutely nothing — permissions are never repaired and
#   users lose SSH access after every reboot with no error anywhere.
#
#   Verified by deliberately breaking the state (chmod 777 ~/.ssh + emptying
#   authorized_keys) with the service running: nothing was repaired after 8 s.
#
# This version uses plain polling instead: no inotify dependency, nothing that
# can fail silently. It is idempotent and cheap (a few stat calls per interval).
# ---------------------------------------------------------------------------
#
# Usage: check_and_fix_ssh_permissions.sh <user> [interval_seconds]
#
# Exit codes: 1 = bad usage. The script otherwise runs until the service is
# stopped (systemd Restart=always keeps it alive across reboots).

USER="$1"
if [ -z "$USER" ]; then
    echo "usage: $0 <user> [interval_seconds]" >&2
    exit 1
fi
INTERVAL="${2:-5}"

HOME_DIR="/home/$USER"
SSH_DIR="$HOME_DIR/.ssh"
AUTHORIZED_KEYS="$SSH_DIR/authorized_keys"
OWNER=$(stat -c '%u:%g' "$HOME_DIR" 2>/dev/null)

# Function to set permissions (idempotent)
set_permissions() {
    [ -d "$SSH_DIR" ] || mkdir -p "$SSH_DIR" 2>/dev/null

    if [ "$(stat -c '%a' "$HOME_DIR" 2>/dev/null)" != "700" ]; then
        echo "Setting permissions for $HOME_DIR to 700"
        chmod 700 "$HOME_DIR"
    fi

    if [ "$(stat -c '%a' "$SSH_DIR" 2>/dev/null)" != "700" ]; then
        echo "Setting permissions for $SSH_DIR to 700"
        chmod 700 "$SSH_DIR"
    fi

    [ -f "$AUTHORIZED_KEYS" ] || touch "$AUTHORIZED_KEYS"

    if [ "$(stat -c '%a' "$AUTHORIZED_KEYS" 2>/dev/null)" != "600" ]; then
        echo "Setting permissions for $AUTHORIZED_KEYS to 600"
        chmod 600 "$AUTHORIZED_KEYS"
    fi

    # Keep ownership consistent with the home directory (UGOS may recreate the
    # files as root after a firmware update).
    if [ -n "$OWNER" ]; then
        chown "$OWNER" "$SSH_DIR" "$AUTHORIZED_KEYS" 2>/dev/null
    fi
}

# Initial permissions check, then enforce on a fixed interval.
set_permissions
while true; do
    sleep "$INTERVAL"
    set_permissions
done
