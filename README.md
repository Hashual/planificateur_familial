# SAE_A_planificateur_familial

# Installation

## Development Environment
### Requirements
- Docker
- Docker Compose

### Installation
1. Clone the repository
2. Duplicate the `.env.example` file and rename it to `.env` in the `api` folder
3. Run the following command in the root folder of the project:
```bash
docker-compose -f docker-compose-dev.yml up --build
```

### Known Issues
#### Database Connection
Sometimes, the database connection is not established.

#### Verification
To verify if the database connection is established, you can first check if you have an error message in the **API** container logs. If you don't have any error message, it means that the connection is established.

#### Solution
Wait **2/3 minutes** (waiting for the database to be fully initialized) and **restart** the **API** container.

### NPM Packages Not Found
Sometimes, you have an error message that says that the packages are not found.

#### Verification
In each node container, check if you have an error message like `Cannot find module 'xxxx' or its corresponding type declarations.`

#### Solution
Run the following command on your computer:
```
cd api/ && npm install --dev && cd ../free-go/ && npm install --dev && cd ../
```
Then, restart the **API** and **FreeGo** containers.