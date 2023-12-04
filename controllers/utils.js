const mqtt = require("mqtt");
const { v4: uuidv4 } = require('uuid');


const mqttOptions = {
    host: '73e368c7f57643c2878ff0a174ea80fe.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'patientAPI-test',
    password: 'Test1234'
};
const client = mqtt.connect(mqttOptions);

/*This map is responsible for storing res objects with a unique identifier as the key */
const responseMap = new Map();
//This map stores appointments awaiting additional dentist information
const appointmentsMap = new Map();
/*This map stores a mapping between a dentistRequestID and a requestID, 
this is used to easily find dentistGetRequests sent through getDentistInfo function*/
const dentistRequestIDToRequestID = new Map();

//defines topics and a corresponding message handler
const messageHandlers = {
    "grp20/res/appointments/": handleAppointmentResponse,
    "grp20/res/timeSlots/": handleTimeSlotResponse,
    "grp20/res/dentists/": handleDentistResponse,
    "grp20/res/patients/": handlePatientResponse
}

//Generates a list of topics for the MQTT client from messageHandlers keys.
const subscribeTopics = Object.keys(messageHandlers).map(topic => topic + '+');

/*Handles received messages, if the topic matches a key in messageHandler it calls the 
corresponding function*/
client.on("message", (topic, message) => {
    try {
        const messageJson = JSON.parse(message.toString());
        for (const key in messageHandlers) {
            if (topic.startsWith(key)) {
                messageHandlers[key](messageJson)
                break;
            }
        }
    } catch (err) {
        console.error(err.message)
    }
});

async function handleAppointmentResponse(message) {
    const requestID = message.requestID;
    const appointments = message.appointments;
    appointmentsMap.set(requestID, appointments)

    getDentistInfo(appointments, requestID);
}

async function handleTimeSlotResponse(message) {
    sendResponse(message);
}

async function handleDentistResponse(message) {
    //checks if the response should be amended to an appointment
    if (dentistRequestIDToRequestID.has(message.requestID)) {
        const initialRequestID = dentistRequestIDToRequestID.get(message.requestID);
        aggregateDentistInfo(message, initialRequestID);
    }
    else {
        sendResponse(message);
    }
}

async function handlePatientResponse(message) {
    sendResponse(message);
}

async function aggregateDentistInfo(message, initialRequestID) {
    //gets the array of appointments
    const appointments = appointmentsMap.get(initialRequestID);
    //gets the appointment to update
    const appointment = appointments.find(appointment => appointment.dentistRequestID === message.requestID)

    if (appointment) {
        appointment.dentistInfo = message;
    }


    //Checks if all appointments have dentistInfo
    const haveDentistInfo = appointments.every(appointment => appointment.hasOwnProperty("dentistInfo"));

    if (haveDentistInfo) {
        const message = {
            requestID: initialRequestID,
            appointments: appointments
        }
        sendResponse(message)
    }
}

async function getDentistInfo(appointments, initialRequestID) {
    const publishTopic = "grp20/req/dentists/get";

    for (const appointment of appointments) {
        const uuid = uuidv4();
        appointment.dentistRequestID = uuid;

        dentistRequestIDToRequestID.set(uuid, initialRequestID);

        const dentistID = appointment.dentistID;
        client.publish(publishTopic, JSON.stringify({
            dentistID: dentistID,
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err);
            }
        })
    }
}

async function sendResponse(message) {
    if (message.hasOwnProperty("requestID")) {
        const res = responseMap.get(message.requestID);

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