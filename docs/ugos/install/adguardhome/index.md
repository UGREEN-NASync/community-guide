# How to install AdGuard Home on Docker

> [!NOTE]   
>AdGuard Home needs to bind to port 53 (DNS). On UGOS, this port is often already used by `dnsmasq` or other services.  
>Before installing, ensure that no other service is using port 53, or be prepared to disable/conflict-resolving as described below.


AdGuard Home is a network-wide DNS server and blocker that filters ads, trackers, and malicious domains at the DNS level — before they even reach your devices. It acts as a local DNS resolver, allowing you to:

  - Block ads and trackers on all devices (even smart TVs and game consoles)
  - Monitor and control internet traffic on your network
  - Set parental controls and filtering rules
  - Protect your privacy by avoiding third-party DNS providers

Unlike browser-based ad blockers, AdGuard Home works for all devices on your network — with no need to install anything on each one.

> [!WARNING]  
>This guide was last tested for AdGuard Home v0.107.63


## Deploy Container Using Docker Compose

To quickly deploy AdGuard Home on UGREEN NAS, it is recommended to use Docker Compose for project management. This method is suitable when you need to create and manage multiple containers, making containerized management convenient.

### 1. Access the Docker Project Interface

In the UGOS Pro system of UGREEN NAS, open the "Docker" app, click "Project > Create" to start the project creation wizard.

### 2. Configure the Docker Compose File

In the wizard, you'll need to provide a Docker Compose configuration file. Below is the example configuration file for AdGuard Home:

```yml
services:
    adguardhome:
        image: adguard/adguardhome:latest
        container_name: adguardhome
        restart: unless-stopped
        volumes:
            - /volume2/docker/adguardhome/work:/opt/adguardhome/work
            - /volume2/docker/adguardhome/conf:/opt/adguardhome/conf
        network_mode: host
        # The following port mappings are commented out because they are not required when using network_mode: host.
        # With host networking, the container uses the host's network stack directly and can bind to the necessary ports without explicit mappings.
        # However, these lines are included as a reference for which ports AdGuard Home typically uses, in case you ever switch to bridge mode or need to troubleshoot:
        # ports:
        #     - 53:53/tcp   # DNS
        #     - 53:53/udp   # DNS
        #     - 67:67/udp   # DHCP
        #     - 68:68/udp   # DHCP
        #     - 80:80/tcp   # Admin Panel
        #     - 443:443/tcp # Admin Panel
        #     - 443:443/udp # DNS over HTTPS
        #     - 3000:3000/tcp # Admin Panel
        #     - 853:853/tcp # DNS over TLS
        #     - 853:853/udp # DNS over QUIC
        #     - 5443:5443/tcp # DNSCrypt
        #     - 5443:5443/udp # DNSCrypt
        #     - 6060:6060/tcp # Debugging
```

::: details

  - The volumes directive enables persistent storage for AdGuard Home. The local directories `/volume2/docker/adguardhome/work` and `/volume2/docker/adguardhome/conf` on the NAS are mapped to `/opt/adguardhome/work` and `/opt/adguardhome/conf` inside the container. This ensures that all configuration files, logs, and runtime data are stored on the NAS and survive container restarts or updates.
  - The container_name is set to adguardhome, making it easier to manage the container directly using Docker CLI commands like docker restart adguardhome.
  - The image directive specifies the AdGuard Home Docker image. Using the latest tag ensures that the container always pulls the most recent stable version when recreated.
  - The restart policy is set to unless-stopped, which means the container will automatically restart after a crash or reboot, unless you explicitly stop it.
  - The network_mode is set to host, allowing AdGuard Home to bind directly to ports on the NAS’s network interface. This is required for it to listen on DNS port 53 and handle requests from all devices in your network without complex port forwarding.
  - **Note:** The commented-out `ports:` section in the Compose file above is not needed with `network_mode: host`, but is included for your reference. If you use bridge networking instead, you must uncomment and adjust these port mappings.
:::

### 3. Deploy the Project

Once the deployment is complete, you can access the AdGuard Home web interface by visiting `http://your-nas-name.local:3000` in your browser.

> [!WARNING]
> Preventing Port Conflicts with `dnsmasq`:
>
>By default, UGOS uses `dnsmasq` to handle DNS requests, which binds to port `53` on `localhost`. This will conflict with AdGuard >Home, which also needs to bind to port `53`.

To resolve this, you need to stop and disable `dnsmasq`:

### Steps to disable `dnsmasq` on UGOS

1. Open a terminal on your computer and connect to your NAS via SSH:

```bash
ssh youruser@yourNASiP
```

2. Disable dnsmasq:

```bash
sudo systemctl stop dnsmasq
sudo systemctl disable dnsmasq
```

3. Check if port 53 is now free:

```bash
sudo lsof -i :53
```

If the command returns no output, port 53 is no longer in use. After that, you should restart your AdGuard Home container.
::: warning
 Disabling dnsmasq may affect other NAS-related DNS services. Make sure that AdGuard Home is configured correctly and starts automatically to take over its functionality.
:::

## ⚙️ Initial Configuration of AdGuard Home

After the container starts successfully, open the web interface again by visiting  `http://your-nas-name.local:3000` in your browser.

You will be guided through a short setup wizard. In the wizard:

- Set a username and password for the admin interface.
- Configure which upstream DNS servers to use (e.g., 1.1.1.1 or 8.8.8.8).
- Define the listening interfaces (usually 0.0.0.0 to listen on all).
- Optionally enable DHCP services, if AdGuard Home should manage IPs on your network.
- Review and apply your settings.

Make sure to set your router or clients to use your NAS IP as their DNS server so AdGuard Home becomes active in your network.

After the container starts successfully, open the web interface again by visiting  `http://your-nas-name.local:3000` in your browser.

You will be guided through a short setup wizard. In the wizard:

- Set a username and password for the admin interface.
- Configure which upstream DNS servers to use (e.g., 1.1.1.1 or 8.8.8.8).
- Define the listening interfaces (usually 0.0.0.0 to listen on all).
- Optionally enable DHCP services, if AdGuard Home should manage IPs on your network.
- Review and apply your settings.

## 🚀 Next Steps & Advanced Configuration

Now that AdGuard Home is up and running, consider these next steps to enhance your setup:

- **Customize Filtering:**  
  Add custom blocklists, allowlists, or create client-specific rules for granular control.

- **Enable DNS-over-HTTPS/TLS/QUIC:**  
  Increase privacy by enabling encrypted DNS protocols in *Settings > DNS Settings*.

- **Backup Configuration:**  
  Periodically export your AdGuard Home configuration for disaster recovery.



Make sure to set your router or clients to use your NAS IP as their DNS server so AdGuard Home becomes active in your network.


For more advanced topics and troubleshooting, visit the [official AdGuard Home documentation](https://github.com/AdguardTeam/AdGuardHome/wiki).


