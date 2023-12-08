# Patient API
Welcome to the Patient API! This API is intended to handle communication between micro services and a patient client.

## Getting started

This service is written in NodeJS. [Check this link for more information about NodeJS.](https://nodejs.org/en).

To run this service you need to follow the steps described below:

### Installing NodeJS using BREW (if you dont have NodeJS)

If you do not have NodeJS installed on your computer you can download both brew and NodeJS with these commands:

#### Install brew
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
``````

If this command does not work, [check here](https://brew.sh/).

#### Install NodeJS with brew
```
brew install node
``````

### Add .env file (in the root folder)
The .env file contains information about the MQTT broker. This informatin is best contained locally on your computer, to keep your connections private. You will have to insert a BROKER_URL (separated in to MQTT_HOST and MQTT_PORT).

For our instances of the service, we used a [HIVE](https://www.hivemq.com/mqtt/) private broker.

```
MQTT_HOST='YOUR_HOST'
MQTT_PORT='YOUR_PORT'
MQTT_PROTOCOL='YOUR_PROTOCOL'
MQTT_USERNAME='YOUR_USERNAME'
MQTT_PASSWORD='YOUR_PASSWORD'
```


### Run Patient API
In order to build and run the Patient API you need to type these commands in to your terminal:


```
npm run dev
```
Congratulations! You are now running the Patient API.
 

## Roadmap
This service will not get updated in the future, due to project being considered as closed when GU course DIT356 is finished.


## Authors and acknowledgment
This service is a part of DIT356 distributed systems course, and is created by Group 20. [Check here for more information about the entire project.](https://git.chalmers.se/courses/dit355/2023/student-teams/dit356-2023-20/group-20-distributed-systems/-/wikis/home)

***WIP DUE TO SERVICE STILL BEING DEVELOPED***

In this service the following people have contributed:

- Lucas Holter
- Cornelia Olofsson Larsson
- James Klouda
- Jonatan Boman
- Mohamad Khalil
- Joel Mattson



## Project status
The service may recieve updates until 9th January 2024, and none after.
