# -----------------------------------------------------------------------------------------------------------
#                                            IMPORTANT
# -----------------------------------------------------------------------------------------------------------
# Fill in missing info as required before attempting deployment. 
# Find comments beginning with "EDIT_REQUIRED" to quickly make changes
# After editing, rename and save the file as "deploy_with_docker.sh"
# -----------------------------------------------------------------------------------------------------------

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg -y
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install latest version of docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Clone the github repo
git clone https://github.com/Valeron-T/restaverse.git

# EDIT_REQUIRED: Create the .env file inside the api directory. (Same as "restaverse/api/.env")
cat > restaverse/api/.env <<EOF
DEBUG=False
CLIENT_ID=
SECRET_KEY=
FRONTEND_URL=
BACKEND_URL=
ALGORITHM=HS256
EOF

# EDIT_REQUIRED: Create the JSON file inside the api directory. (Same as "restaverse/api/client_secret.json")
cat > restaverse/api/client_secret.json <<EOF
{
   "web":{
      "client_id":"",
      "project_id":"",
      "auth_uri":"",
      "token_uri":"",
      "auth_provider_x509_cert_url":"",
      "client_secret":"",
      "redirect_uris":[
         "http://your-backend-url"
      ]
   }
}
EOF

# EDIT_REQUIRED: Create the .env file inside the client directory
cat > restaverse/client/.env.local <<EOF
VITE_BASEAPI_URL=
EOF

# Start docker compose
cd restaverse
sudo docker compose up -d --build
