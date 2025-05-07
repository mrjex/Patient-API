# Patient API

> ⚠️ **Disclaimer**: This is a **fork** of [Patient API](https://github.com/Dentanoid/Patient-API), originally created and maintained by the [Dentanoid Organization](https://github.com/Dentanoid)

Welcome to the Patient API! This serves as the main hub of communication between the patient client and the different services of the dentanoid system.

## Table of contents

- [Patient API](#patient-api)
  - [About the API](#about-the-api)
    - [Aggregation of data](#aggregation-of-data)
    - [Authentication](#authentication)
    - [MQTT test client](#mqtt-test-client)
    - [How the API handles mqtt messages](#how-the-api-handles-mqtt-messages)
    - [Extending and modifying functionality](#extending-and-modifying-functionality)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [Installing NodeJS using BREW (if you dont have NodeJS)](#installing-nodejs-using-brew-if-you-dont-have-nodejs)
      - [Install brew](#install-brew)
      - [Install NodeJS with brew](#install-nodejs-with-brew)
    - [Add .env file (in the root folder)](#add-env-file-in-the-root-folder)
    - [Run Patient API](#run-patient-api)
  - [Roadmap](#roadmap)
  - [Authors and acknowledgment](#authors-and-acknowledgment)
  - [Project status](#project-status)


## About the API

As previously mentioned the Patient API serves as the middleman between the client and the services compromising the dentanoid system. The API accepts HTTP requests, these requests are then 'put on hold' in a map, where the ```Express``` response object is matched with a unique request id. After this the API publishes MQTT messages and awaits a response from the different services. When a MQTT message with the appropriate request id is received the matching response object is retrieved and handled by responding to the initial request. This approach ensures that the correct request gets a response with the intended requested information.

### Aggregation of data

The API aggregates some data for the user, when fetching all of a user's appointments, it is reasonable to assume that the user would also be interested in fetching the dentist and clinic connected to that specific appointment. Because of this, the API then fetches this information from the the clinic and user service, and amends it to the appointment information before sending the response. This is done in order to reduce the amount of requests needed to be sent to the API.

This type of aggregation of data is only applied for a users appointments currently, but there is potential for expanding this further in the future if the need for it arises.

### Authentication

The API handles authentication with ```json-webtoken```, some endpoints are 'blocked off' by expecting the presence of a valid webtoken.
When a request is made to one of these endpoints without the token, the request is rejected and a 401 or 403 status code is returned.

Be mindful that when running the API in test mode, the authentication is bypassed.

### MQTT test client

The MQTT test client is used for testing certain aspects of the API. The 'real' MQTT client is substituted with the test client when the API runs in test mode. This test client doesn't publish any real messages and never connects to a broker, in essence when it 'publishes' a message it triggers the on message event passing whatever it published as the message. This can be used to test the behaviour of endpoints without needing to rely on the different services.

### How the API handles mqtt messages

When the API gets a mqtt message from a service, it in essence parses the message content to check for a valid request id and a status code. It then responds to the initial http request with the message it received and the status code present in that message. The only exceptance to this is when aggregating data for appointments ([aggregation of data](#aggregation-of-data)).

### Extending and modifying functionality

Mqtt subscription topics are handled centrally in ```messageHandlers.js```, in order to add a new topic just add a topic with a corresponding message to the ```messageHandlers``` object along with a corresponding message handler function. This method should ideally pass the message along to the sendResponse function from ```responseHandler.js```, which will parse the status code of the message, match it with a response object and lastly send a response to the initial HTTP request.

The publishing of MQTT messages is handled by the controllers in the controller folder. This is also where the response object is stored and the request id is generated. These controllers are triggered by the routes in the route folder.


## Getting started

This service is written in NodeJS. [Check this link for more information about NodeJS.](https://nodejs.org/en).

To run this service you need to follow the steps described below:

### Installing NodeJS using BREW (if you dont have NodeJS)

If you do not have NodeJS installed on your computer you can download both brew and NodeJS with these commands:

#### Install brew

``` javascript
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

If this command does not work, [check here](https://brew.sh/).

#### Install NodeJS with brew

```
brew install node
``````

### Add .env file (in the root folder)
The .env file contains information about the MQTT broker. This informatin is best contained locally on your computer, to keep your connections private. You will have to insert a BROKER_URL (separated in to MQTT_HOST and MQTT_PORT).

For our instances of the service, we used a [HIVE](https://www.hivemq.com/mqtt/) private broker.

``` javascript
MQTT_HOST='YOUR_HOST'
MQTT_PORT='YOUR_PORT'
MQTT_PROTOCOL='YOUR_PROTOCOL'
MQTT_USERNAME='YOUR_USERNAME'
MQTT_PASSWORD='YOUR_PASSWORD'

TOKEN_SECRET='YOUR_TOP_SECRET_SECRET'
```

### Run Patient API

In order to build and run the Patient API you need to type these commands in to your terminal:

```
npm install // run this command if you have not already installed npm

npm run dev
```
Congratulations! You are now running the Patient API.

## Roadmap

This service will not get updated in the future, due to project being considered as closed when GU course DIT356 is finished.

## Authors and acknowledgment

- Lucas Holter
- Cornelia Olofsson Larsson
- James Klouda
- Jonatan Boman
- Mohamad Khalil
- Joel Mattson

## Project status

The service may recieve updates until 9th January 2024, and none after.
