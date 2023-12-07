const { responseMap, sendResponse } = require('./responseHandler');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');


//This map stores appointments awaiting additional dentist information, requestID is used as the key.
const appointmentsMap = new Map();
/*This map stores a mapping between a dentistRequestID and a requestID, 
this is used to easily find dentistGetRequests sent through getDentistInfo function*/
const dentistRequestIDToRequestID = new Map();


async function aggregateDentistInfo(message, initialRequestID) {
    try {
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
            //Deleting the map entries so they don't grow infinitely
            appointmentsMap.delete(initialRequestID);
            appointments.forEach(appointment => {
                dentistRequestIDToRequestID.delete(appointment.dentistRequestID);
            })
            sendResponse(message);
        }
    }
    catch (err) {
        console.error("aggregateDentistInfo:", err.message);
    }
}

async function getDentistInfo(client, appointments, initialRequestID) {
    try {
        const publishTopic = "grp20/req/dentists/get";
        for (const appointment of appointments) {
            const uuid = uuidv4();
            appointment.dentistRequestID = uuid;

            dentistRequestIDToRequestID.set(uuid, initialRequestID);

            const dentistID = appointment.dentistID;
            client.publish(publishTopic, JSON.stringify({
                dentist_id: dentistID,
                requestID: uuid
            }), (err) => {
                if (err) {
                    console.error(err);
                }
            })
            mqttTimeout(uuid, 20000)
        }
    }
    catch (err) {
        console.error("getDentistInfo:", err.message);
    }

}

async function generateJWT(patient_id) {
    return jwt.sign({patient_id: patient_id}, process.env.TOKEN_SECRET, {expiresIn: '1800s'})
}

async function mqttTimeout(uuid, time) {
    setTimeout(() => {
        const response = responseMap.get(uuid)
        if (response) {
            responseMap.delete(uuid);
            response.status(504).json({ error: "Server timed out" });
        }
        //delete key value pairs incase of timeouts.
        appointmentsMap.delete(uuid);
        dentistRequestIDToRequestID.delete(uuid);
    }, time)
};

module.exports = {
    aggregateDentistInfo,
    getDentistInfo,
    mqttTimeout,
    appointmentsMap,
    dentistRequestIDToRequestID,
    generateJWT
};