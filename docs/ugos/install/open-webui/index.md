# How to Install OpenWebUI

OpenWebUI is an extensible, self-hosted AI interface designed to operate entirely offline, offering users full control over their data and privacy. It supports various LLM runners, including Ollama and OpenAI-compatible APIs, making it a versatile tool for deploying AI models in a secure environment. The platform is highly customizable, allowing users to adapt it to their specific workflows through plugins and integrations. Whether for personal or professional use, OpenWebUI provides a robust solution for AI deployment, ensuring that users can leverage AI capabilities without compromising on privacy or security. With an active development community, OpenWebUI continues to evolve, offering new features and improvements to enhance user experience.

## Deploy Container Using Docker Compose

To quickly deploy OpenWebUI, it is **recommended** to use Docker Compose for project management. This method is suitable when you need to create and manage multiple containers, making containerized management convenient. The following detailed steps will guide you on how to deploy OpenWebUI using Docker Compose.

### 1. Access the Docker Project Interface

In your system, open the "Docker" app, click "Project > Create" to start the project creation wizard.

### 2. Configure the Docker Compose File

In the wizard, you'll need to provide a Docker Compose configuration file. The Docker Compose file for OpenWebUI can be found [here](https://github.com/open-webui/open-webui).

::: details
- Specify the OpenWebUI Docker image to use. The `latest` tag ensures that the most recent version is pulled.
- Ensure the configuration includes necessary environment variables for your setup, such as time zone settings. This is essential for maintaining consistent timestamps for automated tasks and logs. You can adjust the time zone to match your location (e.g., `America/Chicago` or `Europe/Berlin`).
:::

### 3. Deploy the Project

After confirming that the configuration file is correct, click "Deploy Now". The system will automatically pull the image and start the container. Once the deployment is complete, you can access the OpenWebUI Webpage by visiting `your-server-name.local:[port]` in your browser.

::: info Credit
This guide was created by [Topiga](https://github.com/topiga/). Consider sponsoring [Timothy Jaeryang Baek](https://github.com/sponsors/tjbck) to support their great work!
:::
