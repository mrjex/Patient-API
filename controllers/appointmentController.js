const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

/* GET appointments/users/:patientID' 
gets appointments with matching patientID. */
async function getUsersAppointments(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }

    const uuid = uuidv4();
    try {
        const patient_id = req.patient.patient_id;
        const publishTopic = "grp20/req/timeslots/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            patient_id: patient_id,
            requestID: uuid
        }), (err) => { if (err) { next(err) } });
        mqttTimeout(uuid, 10000)
    }
    catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}
/* POST appointments/ 
Create appointment using a patientID and timeslotID*/
async function createAppointment(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }

    const uuid = uuidv4();
    try {
        const availableTimes_id = req.body.availableTime_id;
        const patient_id = req.patient.patient_id;
        const publishTopic = "grp20/req/availabletimes/book"

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            _id: availableTimes_id,
            patient_id: patient_id,
            requestID: uuid
        }), (err) => { if (err) { next(err) } });
        mqttTimeout(uuid, 10000)
    }
    catch (err) {
        responseMap.delete(uuid);
        next(err)
    }
}
/* DELETE appointments/:appointmentID 
DELETE appointment using an appointmentID*/
async function cancelAppointment(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }

    const uuid = uuidv4();
    try {
        const appointmentID = req.params.appointmentID;
        const publishTopic = "grp20/req/appointment/delete"
        const patient_id = req.patient.patient_id;

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            patient_id: patient_id,
            appointment_id: appointmentID,
            requestID: uuid
        }), (err) => { if (err) { next(err) } });
        mqttTimeout(uuid, 10000)
    }
    catch (err) {
        responseMap.delete(uuid);
        next(err)
    }
}
module.exports = {
    getUsersAppointments,
    createAppointment,
    cancelAppointment
};
