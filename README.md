# Review Manager Portal

### Project Link
- http://restaverse-tf-312.centralindia.cloudapp.azure.com/

### Overview
- This project creates a centralized dashboard where business owners can manage the reviews across all their business locations in one place using Google MyBusiness API. 
- It features a homepage allowing users to quickly reply to the latest reviews via an intuitive UI. 
- Additionally, a reviews page displays more information about reviews, including modification dates. 
- Reviews are color-coded to differentiate between positive, negative, or neutral feedback.
- Google Oauth implementation for seamless login.

### Technologies Used
- Frontend: React.js
- Backend: Flask
- Styling: Tailwind.css
- Deployment: Docker, Terraform and Microsoft Azure

### Challenges Faced
- The main challenge in this project was setting up Oauth. 
  - Making sure the Oauth token is always secure by encrypting it during transport from client to server or vice versa and the means of passing it to the server using headers. 
  - Understanding how oauth works was key to overcoming it along with Google's Documentation, tutorials and even Stackoverflow.
- As there was no access to Google's My Business API, there was a need to create a mock API that replicates responses that the original API would send.
- To implement the actual API, we would have to have some way to test it. Even if we follow the docs, we cannot guarantee that there won't be any issues.

### Future Prospects
- Features
    - Add analytics and visualisationbased on review data
    - Allow more filtering options for reviews
    - Enhance UI/UX (e.g., subtle animations)
    - Implement caching
    - Allow advanced users to run queries against the data
- Dev side:
    - Secure the server with SSL
    - Implement visualization using chart.js or similar modules
    - Autoscaling
    - Strengthen security using a proxy server to access the client for isolation
    - Conduct extensive testing

## How to use the website ?
1. Sign in with google by clicking the icon at the bottom of the navbar.
2. On successfull sign-in, one can see the latest reviews in the home page. The home page has the quick reply option which can be toggled by hovering over it.
3. From there the user can post a reply or delete a previous reply.
4. If a user want to see more detailed information about each review, then they can go to the reviews tab. This tab also allows filtering by available locations.
5. To logout, click the very same user icon at the bottom of the navbar

## Note
- Currently anyone who logs in with a google acc can view/modify/reply to reviews as data is fetched from a json which mimics the response format of google API.

## How to Run this Project ?
### Mandatory Steps
1. Go to the Google Cloud Console.
2. Select or create a new project where your React app will be registered.
3. Navigate to "APIs & Services" > "Credentials".
4. Configure OAuth consent screen if prompted. (Fill in mandatory details only)
5. Click on "Create credentials" and choose "OAuth client ID" from the dropdown menu.
6. Select "Web application" as the application type.
7. Give it any name and create.
8. If setting up for local development:
   - Add `http://localhost:5173` (or any port of your choice) to the Authorized JavaScript origins.
   - Add `http://localhost:5000/callback` (or any port of your choice) to the Authorized redirect URIs.
   - Else, add URLs/IPs for the frontend deployment.
9. Download the credentials JSON file and rename it to `client_secret.json`.
10. Copy the `client_secrets.json` file into the API folder.
11. For actual API usage, enable relevant Business APIs under "Enabled APIs and services."
12. Configure environment variables for the API/server:
   - Create a `.env` file in the API folder.
   - Refer to `.env-dummy.txt` and fill in required values for:
     - DEBUG (true for debug mode in Flask and test routes)
     - CLIENT_ID (copy from `client_secrets.json`)
     - SECRET_KEY (copy from `client_secrets.json`)
     - FRONTEND_URL (URL of the client with port)
     - BACKEND_URL (URL of the server with port)
     - ALGORITHM (set to HS256 for encrypting/decrypting JWT)
13. Configure environment variables for the client:
   - Create a `.env.local` file in the client folder.
   - Set `VITE_BASEAPI_URL` to the same value as `FRONTEND_URL` above.
14. Proceed to any of the deployment options below.

- ### Locally using Node and Python
    - Prerequisites (older versions may work but cannot guarantee)
      - Python 3.11+
      - Node v20 +
      - Npm v8+
    - Steps
      1. Navigate to /client and install dependencies

         ``` bash
         cd client
         npm install 
         ```
      2. If everything was successful, you can now test if the client works by running npm run dev. 
      3. Going to the output URL, you'll be able to access the React client. We now have to set up the Flask server to complete deployment
      4. Currently, we are running a development server with support for hot reload. To build for production, we can use npm run build followed by npm run preview
      5. Navigate to /API and install dependencies using
      
            ``` bash
            pip install -r requirements.txt
            ```
      6. Use ``` python3 -m flask --app app ``` run --debug to run the server in development mode.
      7. Now you should have the client and server running successfully.
- ### Locally using Docker
    - Methods to Run this Project
  - Prerequisites
    - Docker engine installed and running
  - Steps
    - Navigate to client folder
      ``` bash
      docker build -t "tag/name of your choice" . 
      # Eg: docker build -t myclient .
      ```
    - Run the client container
      ``` bash
      docker run -p <host port>:<client port (of container)> --env-file ./.env.local -d "chosen tag" 
      # Eg: docker run -p 80:3000 --env-file ./.env.local myclient
      ```
    - Navigate to the API folder
      ```bash
      docker build -t "tag/name of your choice" . 
      # Eg: docker build -t myclient .
      ```
    - Run the server container
      ```bash
      docker run -p <host port>:<client port (of container)> --env-file ./.env -d <chosen tag> 
      # Eg: docker run -p 5000:5000 --env-file ./.env -d myserver
      ```
    ### Note 
      - The Dockerfiles are configured to deploy a production environment. To set up for deployment, we would have to modify the Dockerfiles to use the dev run commands and also mount our local files to the Docker container using -v source_path:dest_path in the run command
- ### Locally using Docker Compose
    Prerequisites:
  - Docker engine installed and running
  - Steps:
    - Navigate to the root folder (restaverse)
    - The Docker Compose file essentially just builds and runs the individual Dockerfiles with client and API.
    - Execute the following command:
        ``` bash
        docker-compose -f "docker-compose.yaml" up -d --build
        ```

- ### Azure Deployment using Terraform
    Prerequisites:
    - Valid Microsoft Azure subscription 
    - Az CLI installed on the local machine with auth completed
    - Terraform downloaded and added to PATH

    Steps:
    - Follow the steps mentioned in `infra/deploy_with_docker_sample.sh` and configure accordingly, resulting in a file called `deploy_with_docker.sh`. This script installs Docker in the VM, clones the git repo, creates the env files, and uses Docker Compose to run the entire project.
    - Configure the `sample.tfvars` file similarly. Rename the file or add to `.gitignore` to avoid mistakely commiting it. Refer to `variables.tf` for help/hinting.
    - Validate the deployment by running:
        ``` bash
        terraform plan --var-file "your var filename"
        ```
    - Execute the deployment by running:
        ``` bash
        terraform apply --var-file "your var filename"
        ```

    ### Note
    - This is a very basic method of deploying to the cloud by simply running Docker on a VM. 
    - We can also make use of other PaaS cloud services (such as Azure ACI, AKS) and configure autoscale based on goals and budget.

<details>
  <summary>Screenshots</summary>
  
  ![restaverse-tf-312 centralindia cloudapp azure com_](https://github.com/Valeron-T/restaverse/assets/32789691/1915e867-50b8-4a9b-b418-1301c92bbfa4)
  
  <img src="https://github.com/Valeron-T/restaverse/assets/32789691/ec27b57c-1382-4cc0-b886-306b40dd19cc" width="30%" >
  
</details>
