# Use public key authentication for ssh instead of password

Usually, setting up key based authentication for a SSH server is as simple as a single call to [ssh-copy-id](https://manpages.debian.org/bookworm/openssh-client/ssh-copy-id.1.en.html). However, on UGOS, there are some extra steps required to fix the permission issues.

## Instructions

To fix the SSH permissions, we need to define a new system service. First, you need to log in via SSH:

```sh
ssh USERNAME@IP
```

When asked for a password, use your account password.

Next, create a new file for the script

```sh
sudo nano /usr/local/bin/check_and_fix_ssh_permissions.sh
sudo chmod +x /usr/local/bin/check_and_fix_ssh_permissions.sh
```

and paste the content of [check_and_fix_ssh_permissions.sh](https://raw.githubusercontent.com/UGREEN-NASync/community-guide/refs/heads/main/docs/ugos/tweak/ssh_public_key/check_and_fix_ssh_permissions.sh) inside. Make sure to replace `<USER NAME>` with you actual username.

Next, create the service file

```sh
sudo nano /etc/systemd/system/ssh-permission-monitor@.service 
```

and paste the content of [ssh-permission-monitor@.service](https://github.com/UGREEN-NASync/community-guide/blob/main/docs/ugos/tweak/ssh_public_key/ssh-permission-monitor@.service) inside. Again, replace `<USER NAME>` with you actual username.

Now reload the systemctl daemon:

```sh
sudo systemctl daemon-reload
```

And enable and start the service:

```sh
sudo systemctl enable ssh-permission-monitor@<USER NAME>.service
sudo systemctl start ssh-permission-monitor@<USER NAME>.service
```
Make sure to replace `<USER NAME>` with you actual username.

You can also look at the service status and troublshoot issues:

```sh
sudo systemctl status ssh-permission-monitor@<USER NAME>.service
```

After those steps, your key should be accepted even after system reboots or configuration changes through the UGOS web interface.

::: info Credit
This guide was originally created by [RealMrCr4cker](https://www.reddit.com/user/RealMrCr4cker/) ([Github repo](https://github.com/ln-12/UGOS_scripts/)) and is under an MIT Licence
:::