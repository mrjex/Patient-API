const { sendResponse } = require('./responseHandler');
const {getDentistInfo, aggregateDentistInfo, appointmentsMap, dentistRequestIDToRequestID} = require('./requestUtils');
const { generateJWT } = require('../authentication/authentication');


//defines topics and a corresponding message handler
const messageHandlers = {
    "grp20/res/appointment/": handleAppointmentResponse,
    "grp20/res/availableTimes/": handleAvailableTimesResponse,
    "grp20/res/dentists/": handleDentistResponse,
    "grp20/res/patients/": handlePatientResponse
}

async function handleAppointmentResponse(client, message) {
    try {
        const requestID = message.requestID;
        const appointments = message.appointments;

        if (!appointments) {
            sendResponse(message);
        } else {
            appointmentsMap.set(requestID, appointments)
            getDentistInfo(client, appointments, requestID);
        }

    }
    catch (err) {
        console.error("handleAppointmentResponse:", err.message);
    }

}

async function handleAvailableTimesResponse(client, message) {
    try {
        console.log(message)
        sendResponse(message);
    }
    catch (err) {
        console.error("handleAppointmentResponse:", err.message);
    }
}

async function handleDentistResponse(client, message) {
    try {
        //checks if the response should be amended to an appointment
        if (dentistRequestIDToRequestID.has(message.requestID)) {
            const initialRequestID = dentistRequestIDToRequestID.get(message.requestID);
            aggregateDentistInfo( message, initialRequestID);
        }
        else {
            sendResponse(message);
        }
    }
    catch (err) {
    }

}

/* Function checks if topic is login topic, in that case it generates jwt and attaches to response. 
if not or if the verification was not succesful (not patient_id in mqtt message) sends response normally.*/
async function handlePatientResponse(client, message, topic) {
    try {
        if (message.hasOwnProperty('patient') && topic.endsWith('login')) {
            const token = generateJWT(message.patient._id);
            message.JWTtoken = token;
            sendResponse(message);
        } else {
            sendResponse(message);
        }
    }
    catch (err) {
        console.error(err);
    }
}
module.exports = {messageHandlers}
