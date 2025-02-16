# Setting up Nginx Proxy Manager
[!NOTE]
This guide comes with an optional dashboard for NPM using goaccess. To function correctly it accesses the NPM logs as specified in the `compose.yaml`.  

You can omit the log dashbaord by deleting or commenting the goaccess section in the `compose.yaml`
```yaml
service:
    npm-app:
        ...
    db:
        ...
    # goaccess:
    #     ...
```
## Instructions
Create a new directory called `npm` within the docker folder and create a new `compose.yaml` file. 
The docker compose file for Nginx Proxy Manager (NPM) can be found [here](/docs/ugos/install/npm/compose.yaml).

[!NOTE] 
In your docker app on UGOS create a new network called `proxy`. This network can be used with other docker services to enable container name resolution ("docker DNS"). 

Save the yaml file and create a new file called `.env` in the npm directory. 
Include the following two lines to set the database passwords
```yaml
NPM_DB_PW=  # use ' ' around the password if it contains special characters
NPM_DB_ROOT_PW=  # use ' ' around the password if it contains special characters
```

[!TIP]
You can use the command `openssl rand -base64 48` to generate a random string for passwords, keys or secrets if required. 

After saving both files, right click on the npm folder in the VSCode Explorer and click `Open in integrated terminal`. 
This will open a terminal windows which is already located in the correct directory. 

[!TIP]
To paste into the terminal use `SHIFT+CTRL+V` OR `right mouse button`.

You can now launch the container by executing
```sh
sudo docker compose up -d
```

Next, setup NPM as shown in your browser. Use the default credentials to setup your admin account in NPM. 
Connect to it using `http://LOCAL_SERVER_IP:8181` OR any other external port that you specified for the default port 81 in the `compose.yaml` file.

[!NOTE]
The default login credentials for NPM are `admin@example.com` and `changeme`

## Adding proxy hosts
1. Navigate to `SSL Certificates`, click `Add SSL Certificate` and chose `Lets Encrypt`
2. Domain name = `*.domain.duckdns.org` -> `Use DNS Challenge = True` -> Agree to the ToS
3. It is important to specify `*.YOUR_DOMAIN.com` as this creates a wildcard certificate for any subsequent subdomain that gets created under the main domain name.
4. Chose DuckDNS (or appropriate) as your provider and paste in your Token to replace `your-duckdns-token` in the `Credentials File Content` 
5. Save the SSL certificate
6. Navigate to "Hosts -> Proxy Hosts" and "Add Proxy Host"
7. Specify a domain name such as `nextcloud.domain.duckdns.org`
8. Use `http` as a scheme (for most servcies) and enter your servers local IP adress OR the `container_name` in "Forward Hostname / IP" and the external port of the service (specified in the docker-compose.yaml) in "Forward Port"
9. Activate the toggles for "Block Common Exploits"
10. Navigate to the "SSL" tab and choose the previousyl created wildcard certificate
11. Enable `Force SSL`, `HTTP/2 Support`, `HSTS enabled`, `HSTS subdomains`
12. Click save to save the new proxy host

[!IMPORTANT]
Make sure that the external https port that you specified for NPM in the docker-compose.yaml (e.g. 4443:443 OR 443:443 OR ANY_PORT:443) is forwarded by your router to your server. This should be the only open port on your router! DO NOT open the ports of the individual services directly on your router. This is the whole point of using a reverse proxy such as NPM!
