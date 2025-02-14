# Setting up Nextcloud-AIO
This guide assumes that you have ssh access to your UGreen NAS. It is recommended to use Visual Studio Code to access your servers directories and terminal/CLI. 

The setup process is similar to [Nginx Proxy Manager (NPM)](docs/ugos/install/npm) and all docker services in general for that matter. 
For more information visit the [nextcloud-aio GitHub repository](https://github.com/nextcloud/all-in-one)

## Instructions
Create a new directory called `nextcloud-aio` within the docker folder and create a new `compose.yaml` file. The docker compose file for nextcloud-aio can be found [here](/docs/ugos/install/nextcloud-aio/compose.yaml). 

[!TIP]
The name of the folder always dictates the prefix that docker specifies for all things automatically created, e.g. volumes, networks, service names (unless specified otherwise). 

Save the compose file, right click the `nextcloud-aio` folder in the VSCode Explorer and choose `Open in integrated terminal`. 
Launch the container by executing 

```sh
sudo docker compose up -d
```

Next navigate to your reverse proxy setup (i.e. NPM) and add a new proxy host. 
Enter `nextcloud.YOURDOMAIN.com` as your domain name, type in your servers local IP address in the IP address and type in port `11000` (this is the Apache port made available by nextlcoud-aio). 
In NPM enable `Block common exploits` and `Websocket support`. Navigate to the SSL tab and enable all options and select your wildcard certificate that you created previously. 
Finally navigate to the advanced tab and paste in the following 

```yaml
client_body_buffer_size 512k;
proxy_read_timeout 86400s;
client_max_body_size 0;
```

Next, navigate to your nextcloud domain (i.e. nextcloud.YOURDOMAIN.com) and follow the setup instructions **carefully**. 
Once your nextcloud instance is running, access the `config.php` by executing 

```sh
sudo docker run -it --rm --volume nextcloud_aio_nextcloud:/var/www/html:rw alpine sh -c "apk add --no-cache nano && nano /var/www/html/config/config.php"
```

Change or add the following parameters in the `config.php`. 
A list with all available parameters can be found in the [Nextcloud docs](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html). 

```php
  'default_phone_region' => 'DE', # your locale, i.e. 'EN' according to ISO 3166-1 A-2
  'maintenance_window_start' => 5, # UTC Hour for maintenance windows
  'default_locale' => 'de_DE', # your locale, i.e. 'en_US' according to ISO 639 language codes AND ISO-3166 country codes
  'default_timezone' => 'Europe/Berlin', # your timezone, i.e. 'America/Chicago' or 'America/New_York'
  'system_addressbook_exposed' => 'no', # OPTIONAL to disable system addressbook
```

## Useful commands for nextcloud-aio
To run occ commands execute 
```sh
sudo docker exec --user www-data -it nextcloud-aio-nextcloud php occ YOUR_COMMAND
```

## Helpful Links
- [IANA identifiers for timezones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)
- [ISO 3166-1 country codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes#Current_ISO_3166_country_codes)
- [ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes#Table)