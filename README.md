# News App API (React + TypeScript + Docker Setup)

This project features a news listing API service with filtering and sorting.

## Requirements

For development, you will need Node.js, npm, and Docker installed in your environment.

### Node

- #### Node installation
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

After successful installation, you should be able to run the following commands to verify the installation.

    $ node --version
    v20.11.1

    $ npm --version
    10.2.4

### Docker

- #### Docker installation
  You can find more information about the installation on the [official Docker website](https://www.docker.com/get-started/)

---

## How do you set up the project on a local machine?

- ### Clone the repository
  `$ git clone https://github.com/rogerjacobrj/news-app-backend.git`
- ### Install dependency packages
  `$ npm install`
- ### Create a .env file in the root folder with the following variables

  `$ PORT `
  `$ NEWSAPI_API_KEY`
  `$ GUARDIAN_API_KEY`
  `$ NEWYORK_TIMES_API_KEY`

---

## How to run the project?

- ### Run the command to create a Docker image
  `$ docker build -t news-app-api .`
- ### Run the command to start a Docker container
  `$ docker run --rm --env-file .env -p 3000:3000 --name news-api news-app-api`
- ### Run the command to stop the container
  `$ docker stop news-api`

## How to view the application?

- ### URL
  You can visit the link http://localhost:3000 or [click here](http://localhost:3000/)

## How to build the app for deployment?

- ### Run the command
  `npm run build`