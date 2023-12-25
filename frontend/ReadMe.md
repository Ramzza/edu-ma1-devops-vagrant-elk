# Terminal in following path:

<repo_path>/devops_proj/frontend

# Build image:

docker build -t devops_client .

# Run container:

docker run -p 3000:3000 -d --name devops_cli devops_client

# Export image

docker save -o ../vagrant/provision/cli/devops_cli_img.tar devops_client:latest

# Import image

docker load -i devops_cli_img.tar
