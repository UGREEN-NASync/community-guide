#!/bin/bash

# User's home directory
USER="<USER NAME>"
HOME_DIR="/home/$USER"
SSH_DIR="$HOME_DIR/.ssh"
AUTHORIZED_KEYS="$SSH_DIR/authorized_keys"

# Function to set permissions
set_permissions() {
    echo "Checking permissions..."

    if [ "$(sudo runuser -l $USER -c "stat -c '%a' $HOME_DIR")" != "700" ]; then
        echo "Setting permissions for $HOME_DIR to 700"
        sudo chmod 700 "$HOME_DIR"
    fi

    if [ "$(sudo runuser -l $USER -c "stat -c '%a' $SSH_DIR")" != "700" ]; then
        echo "Setting permissions for $SSH_DIR to 700"
        sudo chmod 700 "$SSH_DIR"
    fi

    if [ "$(sudo runuser -l $USER -c "stat -c '%a' $AUTHORIZED_KEYS")" != "600" ]; then
        echo "Setting permissions for $AUTHORIZED_KEYS to 600"
        sudo chmod 600 "$AUTHORIZED_KEYS"
    fi
}

# Initial permissions check
set_permissions

# Monitor for changes in permissions
while inotifywait -e attrib "$HOME_DIR" "$SSH_DIR" "$AUTHORIZED_KEYS"; do
    set_permissions
done