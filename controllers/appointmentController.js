const { v4: uuidv4 } = require('uuid');
const { mqttTimeout, responseMap, client } = require("./utils")


/* GET appointments/users/:patientID' 
gets appointments with matching patientID. */
async function getUsersAppointments(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }

    const uuid = uuidv4();
    try {
        const patientID = req.params.patientID;
        const publishTopic = "grp20/req/appointments/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            patientID: patientID,
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
        const timeslotID = req.body.timeslotID;
        const patientID = req.body.patientID;
        const publishTopic = "grp20/req/appointments/post/"

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            timeslotID: timeslotID,
            patientID: patientID,
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
        const publishTopic = "grp20/req/appointments/delete/"
        
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            appointmentID: appointmentID,
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
