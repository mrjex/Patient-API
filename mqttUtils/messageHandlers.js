const { sendResponse } = require('./responseHandler');
const {getDentistInfo, aggregateDentistInfo, appointmentsMap, dentistRequestIDToRequestID} = require('./requestUtils');


//defines topics and a corresponding message handler
const messageHandlers = {
    "grp20/res/appointments/": handleAppointmentResponse,
    "grp20/res/availableTimes/": handleAvailableTimesResponse,
    "grp20/res/dentists/": handleDentistResponse,
    "grp20/res/patients/": handlePatientResponse,
    "grp20/res/clinics/" : handleClinicResponse
}

async function handleAppointmentResponse(client, message) {
    try {
        const requestID = message.requestID;
        const appointments = message.appointments;
        appointmentsMap.set(requestID, appointments)

        getDentistInfo(client, appointments, requestID);
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

async function handlePatientResponse(client, message) {
    try {
        sendResponse(message);
    }
    catch (err) {
    }
}

async function handleClinicResponse (client, message) {
    try {
        sendResponse(message);
    } catch (error) {
        console.error("handleClinicResponse:", err.message);
    }
}
module.exports = {messageHandlers}
