# How to Install Nextcloud-AIO

Nextcloud-AIO (All-In-One) is a comprehensive solution that simplifies the deployment of Nextcloud, providing a robust and scalable environment for managing your files, calendars, and contacts. This guide will walk you through setting up Nextcloud-AIO on your UGREEN NAS using either Docker Compose or SSH.

::: warning
This guide was last tested for Nextcloud-AIO v2023.12.0
:::

## Option 1: Deploy Container Using Docker Compose

To quickly deploy Nextcloud-AIO on UGREEN NAS, it is recommended to use Docker Compose for project management. This method is suitable when you need to create and manage multiple containers, making containerized management convenient.

### 1. Access the Docker Project Interface

In the UGOS Pro system of UGREEN NAS, open the "Docker" app, click "Project > Create" to start the project creation wizard.

### 2. Configure the Docker Compose File

In the wizard, you'll need to provide a Docker Compose configuration file. The Docker Compose file for Nextcloud-AIO can be found [here](https://raw.githubusercontent.com/UGREEN-NASync/community-guide/refs/heads/main/docs/ugos/install/nextcloud-aio/compose.yaml).

::: tip
The name of the folder always dictates the prefix that Docker specifies for all things automatically created, e.g., volumes, networks, service names (unless specified otherwise).
:::

### 3. Deploy the Project

After confirming that the configuration file is correct, click "Deploy Now". The system will automatically pull the image and start the container. Once the deployment is complete, you can access the Nextcloud Webpage by visiting `your-nas-name.local:11000` in your browser.

## Option 2: Deploy Using SSH

If you prefer using SSH for more control over the setup process, follow these steps:

### 1. Connect to Your NAS via SSH

Open your terminal and connect to your UGREEN NAS using SSH:

```sh
ssh your-username@your-nas-ip
```

### 2. Create a Directory for Nextcloud-AIO

Create a new directory for Nextcloud-AIO and navigate into it:

```sh
mkdir -p ~/nextcloud-aio
cd ~/nextcloud-aio
```

### 3. Download the Docker Compose File

Download the Docker Compose file for Nextcloud-AIO:

```sh
wget https://raw.githubusercontent.com/UGREEN-NASync/community-guide/refs/heads/main/docs/ugos/install/nextcloud-aio/compose.yaml
```

### 4. Deploy the Container

Run the following command to deploy the container:

```sh
sudo docker compose up -d
```

## Access the Nextcloud Web Interface

After the deployment is complete, open the browser and enter the NAS IP address or name and port (e.g., `192.168.0.188:11000` or `your-nas-name.local:11000`) to access the interface. Follow the setup instructions carefully.

## Configure Reverse Proxy

Next, navigate to your reverse proxy setup (i.e., NPM) and add a new proxy host. Enter `nextcloud.YOURDOMAIN.com` as your domain name, type in your server's local IP address in the IP address field, and enter port `11000` (this is the Apache port made available by Nextcloud-AIO).

In NPM, enable `Block common exploits` and `Websocket support`. Navigate to the SSL tab and enable all options, selecting your wildcard certificate that you created previously. Finally, navigate to the advanced tab and paste in the following:

```yaml
client_body_buffer_size 512k;
proxy_read_timeout 86400s;
client_max_body_size 0;
```

## Configure Nextcloud

Once your Nextcloud instance is running, access the `config.php` by executing:

```sh
sudo docker run -it --rm --volume nextcloud_aio_nextcloud:/var/www/html:rw alpine sh -c "apk add --no-cache nano && nano /var/www/html/config/config.php"
```

Change or add the following parameters in the `config.php`:

```php
  'default_phone_region' => 'DE', # your locale, i.e., 'EN' according to ISO 3166-1 A-2
  'maintenance_window_start' => 5, # UTC Hour for maintenance windows
  'default_locale' => 'de_DE', # your locale, i.e., 'en_US' according to ISO 639 language codes AND ISO-3166 country codes
  'default_timezone' => 'Europe/Berlin', # your timezone, i.e., 'America/Chicago' or 'America/New_York'
  'system_addressbook_exposed' => 'no', # OPTIONAL to disable system addressbook
```

A list of all available parameters can be found in the [Nextcloud docs](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html).

## Useful Commands for Nextcloud-AIO

To run `occ` commands, execute:

```sh
sudo docker exec --user www-data -it nextcloud-aio-nextcloud php occ YOUR_COMMAND
```

## Helpful Links

- [IANA identifiers for timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)
- [ISO 3166-1 country codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes#Current_ISO_3166_country_codes)
- [ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes#Table)

::: info CREDIT
This guide was created by [vzvl](https://github.com/vzvl), and modified by [Topiga](https://github.com/topiga/).
:::