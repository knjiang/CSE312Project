# CSE312 Project

## Setting up

- [Python 3](https://www.python.org/getit/) is required to to run the core server
- [Pipenv](https://pipenv.readthedocs.io/en/latest/install/) is used for managing Python dependency packages
- [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/en/docs/install) are also needed for building the static assets

Of course, you also need to clone this repository to get started.
Many of the commands below assume that you are in the directory containing the cloned repository.

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


## Usage

### Python virtual environment

- Activate the virtual environment with `pipenv shell`
  - This should be done any time you open a new terminal for development
- Deactivate the virtual environment with `deactivate`