---
description: Learn how to contribute to the Ugreen NASync Community Guide by following this step-by-step guide. Fork and clone the repository, set up your development environment, make changes, and submit a pull request for review. Start contributing today!
---

# Contributing Guidelines

We're delighted by your interest in contributing to our project. To streamline your contribution process, we have provided a detailed, step-by-step guide below.

::: tip
For ease of managing your contributions, we recommend using [GitHub Desktop](https://desktop.github.com/), a GUI-based GitHub client.
:::

## Forking and Cloning the Repository

Follow these steps to fork the repository, clone it, create a new branch, and set up your local development environment:

1. Go to the GitHub page of the project [by clicking here](https://github.com/UGREEN-NASync/community-guide)
2. Click on `Fork` in the top right corner. This will create a copy of the repository in your GitHub account
3. Open [GitHub Desktop](https://desktop.github.com/).
4. In the top menu of GitHub Desktop, navigate to `File` > `Clone Repository...`.
5. In the GitHub.com category, you should see the repository that you cloned., 
6. To clone the repository, click on `Clone`.
7. Upon completion of the cloning process, navigate to `Current Branch`, then select `New Branch`. Here, input a descriptive name for your new branch.

::: warning
The main branch is a protected branch. As such, direct editing is not allowed. Always create a new branch for your changes.
:::

8. Navigate to the `community-guide` directory in your local environment.
9. Open the project in an Integrated Development Environment (IDE) of your choice. We recommend [Visual Studio Code](https://code.visualstudio.com/), a feature-rich, free IDE.

## Setting Up the Development Environment

Choose from the two options below to set up your development environment:

### Option 1 (Recommended)

To set up an optimal development environment:

1. [Install Node.js](https://nodejs.org/). We recommend the Long-Term Support (LTS) version.
2. After installation, open the terminal within your IDE and execute the following command:

```shell
npm install
```

::: tip
You can also use your preferred terminal or command-line tool. Just navigate to the `community-guide` directory and run the command there.
:::

3. Start the documentation development server:

```shell
npm run docs:dev
```

4. The terminal will then display a local URL, such as `http://localhost:5173`. Visit this URL in your web browser to see the documentation. The page will automatically refresh as you modify the source files.

### Option 2

This method lets you work directly with markdown files, although it might not accurately render specific Vitepress features.

1. Open [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE.
2. Install the `Markdown Preview GitHub Styling` extension for Visual Studio Code. This can be found in the `Extensions` tab on the sidebar.
3. Open any markdown file from the `docs` directory.
4. To enable the Markdown Preview, open the command palette with `Ctrl + Shift + P` (Windows) or `Ctrl + Cmd + P` (Mac).
5. Search for `Markdown Preview` and select `Markdown: Open Preview`.

::: warning
Keep in mind that Vitepress offers additional features not available in standard markdown. Therefore, this method may not precisely reflect the final formatting when viewed on the actual documentation website.
:::

## Submitting Changes

Once you've made changes, follow the steps below to submit them for review:

1. If you chose Option 1 under [Setting Up the Development Environment](#option-1-recommended), ensure the pages will build correctly by running the following command:

```shell
npm run docs:build
```

::: danger
If the output displays `Command failed` or any other error message, there is an issue. The error message should provide insight into the problem. If you're unsure about the issue, you can contact our staff members in our [Discord Server](https://discord.gg/VDVbz7RzD3).
:::

2. Open GitHub Desktop. The left-hand pane will show the number of changed files.
3. You can view the changes made to each file. Select one file at a time and fill out the `Summary (required)` field. If needed, provide additional details in the `Description` field. Click on `Commit to the branch you created` to commit your changes.
4. Now, click on `Push changes to x` *(x being the name of the branch you created)* to upload your changes to GitHub.

::: tip
If you've committed all the files, well done! Your next step will be to push your changes to GitHub and create a Pull Request.
:::

## Creating a Pull Request

Follow these steps to create a pull request to propose merging your changes into the main branch:

1. With all your changes committed and pushed to your remote branch, it's time to create a pull request.
2. Go to your forked repository on GitHub's website.
3. Click on `New pull request`. You'll be redirected to the original repository's page.
4. Ensure the base repository is `base: main` and the head repository is `<your_username>/<your_branch_name>`.
5. Review your changes and fill out the form. Finally, click on `Create pull request`.
6. After you submit your pull request, CloudFlare will attempt to build your changes to detect any issues. If there are no issues, a repository contributor will review your changes and either merge them or request further changes.

Thank you for your commitment to improving our project!
