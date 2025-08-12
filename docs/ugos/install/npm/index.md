# How to Install Nginx Proxy Manager

Nginx Proxy Manager (NPM) is a powerful tool that simplifies the process of managing Nginx proxy hosts. It provides a user-friendly web interface for handling SSL certificates, reverse proxy settings, and more. This guide will walk you through setting up NPM on your UGREEN NAS using either Docker Compose or SSH, ensuring a seamless and secure configuration.

> [!WARNING]
>This guide was last tested for NPM v2.9.13

## Option 1: Deploy Container Using Docker Compose

To quickly deploy Nginx Proxy Manager on UGREEN NAS, it is recommended to use Docker Compose for project management. This method is suitable when you need to create and manage multiple containers, making containerized management convenient.

### 1. Access the Docker Project Interface

In the UGOS Pro system of UGREEN NAS, open the "Docker" app, click "Project > Create" to start the project creation wizard.

### 2. Configure the Docker Compose File

In the wizard, you'll need to provide a Docker Compose configuration file. The Docker Compose file for NPM can be found [here](https://raw.githubusercontent.com/UGREEN-NASync/community-guide/refs/heads/main/docs/ugos/install/npm/compose.yaml).

::: details
- Specify the NPM Docker image to use. The `latest` tag ensures that the most recent version is pulled.
- Use the environment variable to set the container's time zone. This is essential for maintaining consistent timestamps for automated tasks and logs. You can adjust the time zone to match your location (e.g., `America/Chicago` or `Europe/Berlin`).
:::

### 3. Deploy the Project

After confirming that the configuration file is correct, click "Deploy Now". The system will automatically pull the image and start the container. Once the deployment is complete, you can access the NPM Webpage by visiting `your-nas-name.local:8181` in your browser.

## Option 2: Deploy Using SSH

If you prefer using SSH for more control over the setup process, follow these steps:

### 1. Connect to Your NAS via SSH

Open your terminal and connect to your UGREEN NAS using SSH:

```sh
ssh your-username@your-nas-ip
```

### 2. Create a Directory for NPM

Create a new directory for NPM and navigate into it:

```sh
mkdir -p ~/npm
cd ~/npm
```

### 3. Download the Docker Compose File

Download the Docker Compose file for NPM:

```sh
wget https://raw.githubusercontent.com/UGREEN-NASync/community-guide/refs/heads/main/docs/ugos/install/npm/compose.yaml
```

### 4. Create an Environment File

Create a `.env` file to set the database passwords:

```sh
nano .env
```

Add the following lines to the `.env` file:

```yaml
NPM_DB_PW=  # use ' ' around the password if it contains special characters
NPM_DB_ROOT_PW=  # use ' ' around the password if it contains special characters
```

Save and close the file.

### 5. Deploy the Container

Run the following command to deploy the container:

```sh
sudo docker compose up -d
```

## Access the NPM Web Interface

After the deployment is complete, open the browser and enter the NAS IP address or name and port (e.g., `192.168.0.188:8181` or `your-nas-name.local:8181`) to access the interface. Use the default credentials to set up your admin account in NPM.

::: info NOTE
The default login credentials for NPM are `admin@example.com` and `changeme`.
:::

You should see a login page. Use the email address `admin@example.com` and the password `changeme` to log in. Options will be presented to you to be configured. Leave everything as default.

That's it! You now have a working NPM instance on your machine, congrats! :tada:

## Adding Proxy Hosts

To add proxy hosts to your NPM instance, follow these steps:

1. Navigate to `SSL Certificates`, click `Add SSL Certificate`, and choose `Let's Encrypt`.
2. Domain name = `*.domain.duckdns.org` -> `Use DNS Challenge = True` -> Agree to the ToS.
3. It is important to specify `*.YOUR_DOMAIN.com` as this creates a wildcard certificate for any subsequent subdomain that gets created under the main domain name.
4. Choose DuckDNS (or appropriate) as your provider and paste in your Token to replace `your-duckdns-token` in the `Credentials File Content`.
5. Save the SSL certificate.
6. Navigate to "Hosts -> Proxy Hosts" and "Add Proxy Host".
7. Specify a domain name such as `nextcloud.domain.duckdns.org`.
8. Use `http` as a scheme (for most services) and enter your server's local IP address OR the `container_name` in "Forward Hostname / IP" and the external port of the service (specified in the docker-compose.yaml) in "Forward Port".
9. Activate the toggles for "Block Common Exploits".
10. Navigate to the "SSL" tab and choose the previously created wildcard certificate.
11. Enable `Force SSL`, `HTTP/2 Support`, `HSTS enabled`, `HSTS subdomains`.
12. Click save to save the new proxy host.

> [!IMPORTANT] 
>Make sure that the external HTTPS port that you specified for NPM in the docker-compose.yaml (e.g., `4443:443` OR `443:443` OR `ANY_PORT:443`) is forwarded by your router to your server. This should be the only open port on your router! DO NOT open the ports of the individual services directly on your router. This is the whole point of using a reverse proxy such as NPM!

## Optional: Log Dashboard with GoAccess

This guide comes with an optional dashboard for NPM using GoAccess. To function correctly, it accesses the NPM logs as specified in the `compose.yaml`.

You can omit the log dashboard by deleting or commenting the GoAccess section in the `compose.yaml`:

```yaml
services:
    npm-app:
        ...
    db:
        ...
    # goaccess:
    #     ...
```

::: info CREDIT
This guide was created by [vzvl](https://github.com/vzvl), and modified by [Topiga](https://github.com/topiga/).
:::