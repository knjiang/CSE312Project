# CSE312 Project

## Setting up

- [Python 3.7](https://www.python.org/getit/) is required to to run the core server
- [Pipenv](https://pipenv.readthedocs.io/en/latest/install/) is used for managing Python dependency packages
- [Node.js](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/get-npm) are also needed for the front end.

### Python

1. Create Python virtual environment and install (dev-)dependency packages
   - This can be done with `pipenv install --dev`
   - The dependencies will be determined from the `Pipfile` file
2. Activate the virtual environment
   - This can be done with `pipenv shell`
   - This needs to be done every time you start development

### Node.js

1. Install dependencies
   - This can be done with `npm install`
2. Build static assets
   - This can be done with `npm run start`
### Python virtual environment

- Activate the virtual environment with `pipenv shell`
  - This should be done any time you open a new terminal for development
- Deactivate the virtual environment with `deactivate`


### Start Up

- After activating python virtual environment, deploy the python server with the command `flask run` 
- The front-end server can be started with the command `npm run start` 
- The server can be found at `localhost:3000` 

## Usage

### Docker Startup

- To start up the project, install [Docker](https://docs.docker.com/get-docker/) and Docker for your terminal.
- Run the command `docker compose up` to run the project in your local environment. 
- If login isn't working, please follow the `GOOGLE OAuth Required` step where you will need to make a file called `./server/.env` and follow the steps below in order to get login to work.

### Google OAuth Required

- The login service requires Google OAuth credentials in order to be usable. Please create your own `.env` file in the directory `./server` and fill out `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` by using the steps in `Create authorization details` from https://developers.google.com/identity/sign-in/web/sign-in
