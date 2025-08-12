# How to Install OpenWebUI

OpenWebUI is an extensible, self-hosted AI interface designed to operate entirely offline, offering users full control over their data and privacy. It supports various LLM runners, including Ollama and OpenAI-compatible APIs, making it a versatile tool for deploying AI models in a secure environment. The platform is highly customizable, allowing users to adapt it to their specific workflows through plugins and integrations. Whether for personal or professional use, OpenWebUI provides a robust solution for AI deployment, ensuring that users can leverage AI capabilities without compromising on privacy or security. With an active development community, OpenWebUI continues to evolve, offering new features and improvements to enhance user experience.

> [!WARNING]
>This guide was last tested for OpenWebUI v0.5.20

## Option 1: Deploy Container Using Docker Compose

To quickly deploy OpenWebUI on UGREEN NAS, it is recommended to use Docker Compose for project management. This method is suitable when you need to create and manage multiple containers, making containerized management convenient.

### 1. Access the Docker Project Interface

In the UGOS Pro system of UGREEN NAS, open the "Docker" app, click "Project > Create" to start the project creation wizard.

### 2. Configure the Docker Compose File

In the wizard, you'll need to provide a Docker Compose configuration file. The Docker Compose file for OpenWebUI can be found [here](https://raw.githubusercontent.com/UGREEN-NASync/community-guide/refs/heads/main/docs/ugos/install/open-webui/compose.yaml).

::: details
- Specify the OpenWebUI Docker image to use. The `main` tag ensures that the most recent version is pulled.
- Ensure the configuration includes necessary environment variables for your setup, such as time zone settings. This is essential for maintaining consistent timestamps for automated tasks and logs. You can adjust the time zone to match your location (e.g., `America/Chicago` or `Europe/Berlin`).
:::

### 3. Deploy the Project

After confirming that the configuration file is correct, click "Deploy Now". The system will automatically pull the image and start the container. Once the deployment is complete, you can access the OpenWebUI Webpage by visiting `your-nas-name.local:3000` in your browser.

## Option 2: Deploy Using SSH

If you prefer using SSH for more control over the setup process, follow these steps:

### 1. Connect to Your NAS via SSH

Open your terminal and connect to your UGREEN NAS using SSH:

```sh
ssh your-username@your-nas-ip
```

### 2. Create a Directory for OpenWebUI

Create a new directory for OpenWebUI and navigate into it:

```sh
mkdir -p ~/openwebui
cd ~/openwebui
```

### 3. Download the Docker Compose File

Download the Docker Compose file for OpenWebUI:

```sh
wget https://raw.githubusercontent.com/UGREEN-NASync/community-guide/refs/heads/main/docs/ugos/install/open-webui/compose.yaml
```

### 4. Deploy the Container

Run the following command to deploy the container:

```sh
sudo docker compose up -d
```

## Access the OpenWebUI Web Interface

After the deployment is complete, open the browser and enter the NAS IP address or name and port (e.g., `192.168.0.188:3000` or `your-nas-name.local:3000`) to access the interface.

> [!DANGER] 
> ### Important Note on User Roles and Privacy:
> - **Admin Creation:** The first account created on OpenWebUI gains **Administrator privileges**, controlling user management and system settings.
> - **User Registrations:** Subsequent sign-ups start with **Pending** status, requiring Administrator approval for access.
> - **Privacy and Data Security:** **All your data**, including login details, is **locally stored** on your device. OpenWebUI ensures **strict confidentiality** and **no external requests** for enhanced privacy and security.
>   - **All models are private by default.** Models must be explicitly shared via groups or by being made public. If a model is assigned to a group, only members of that group can see it. If a model is made public, anyone on the instance can see it.

## Next Steps

### Using OpenWebUI with Ollama

Coming soon

### Join the Community

Need help? Have questions? Join the OpenWebUI community:

- [OpenWebUI Discord](https://discord.gg/5rJgQTnV4s)
- [GitHub Issues](https://github.com/open-webui/open-webui/issues)

Stay updated with the latest features, troubleshooting tips, and announcements!

::: info Credit
This guide was created by [Topiga](https://github.com/topiga/). Consider sponsoring [Timothy Jaeryang Baek](https://github.com/sponsors/tjbck) to support their great work!
:::