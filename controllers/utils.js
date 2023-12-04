const mqtt = require("mqtt");
const mqttOptions = {
    host: 'placeholder',
    port: 'placeholder',
    protocol: 'placeholder',
    username: 'placeholder',
    password: 'placeholder'
};
const client = mqtt.connect(mqttOptions);

/*This map is responsible for storing res objects with a unique identifier as the key */
const responseMap = new Map();
const appointmentsMap = new Map();

const messageHandlers = {
    "grp20/res/appointments/": handleAppointmentResponse,
    "grp20/res/timeSlots/": handleTimeSlotResponse,
    "grp20/res/dentists/": handleDentistResponse,
    "grp20/res/patients/": handlePatientResponse
}
const subscribeTopics = Object.keys(messageHandlers).map(topic => topic + '+');

/*Handles received messages, if the topic matches a key in messageHandler it calls the 
corresponding function*/
client.on("message", (topic, message) => {
    try {
        const messageJson = JSON.parse(message.toString());
        for (const key in messageHandlers) {
            if(topic.startsWith(key)){
                messageHandlers[key](messageJson)
                break;
            }
        }
    } catch (err) {
        console.error(err.message)
    }
});

async function handleAppointmentResponse(message){
    
}

async function handleTimeSlotResponse(message) {
    sendResponse(message)
}

async function handleDentistResponse(message){
    
}

async function handlePatientResponse(message) {
    sendResponse(message)
}

async function sendResponse(message){
    if (message.hasOwnProperty("requestID")) {
        const res = responseMap.get(message.requestID)

        if (res) {
            //Checks if the message contains a status code
            if (message.hasOwnProperty("status")) {
                //Sends response with the provided status code & error message
                res.status(parseInt(message.status)).json({ error: message.error, })
            } else {
                res.json(message);
            }
            responseMap.delete(message.requestID);
        } else { console.error("Response object not found for requestID: " + message.requestID) }
    }
}

client.on("connect", () => {
    console.log("Succesfully connected to broker");
    client.subscribe(subscribeTopics);
});

client.on("reconnect", () => {
    console.log("Reconnecting to broker...");
});

client.on("error", (error) => {
    console.error(error);
});

client.on("close", () => {
    console.log("Disconnected from broker");
});

async function mqttTimeout(uuid, time) {
    setTimeout(() => {
        const response = responseMap.get(uuid)
        if (response) {
            responseMap.delete(uuid);
            response.status(504).json({ error: "Server timed out" });
        }

    }, time)
};

module.exports = {
    mqttTimeout,
    client,
    responseMap
};