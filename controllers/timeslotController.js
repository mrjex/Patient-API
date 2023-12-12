const { v4: uuidv4 } = require('uuid');
const { client } = require('../mqttUtils/MQTTclient');
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

/* GET timeslots with matching dentist ID.*/
async function getDentistAvailableTimes(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }

    const uuid = uuidv4();
    try {
        const dentist_id = req.params.dentist_id;
        const publishTopic = "grp20/req/availabletimes/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            dentist_id: dentist_id,
            requestID: uuid
        }), (err) => { if (err) { next(err) } });
        mqttTimeout(uuid, 10000);
    }
    catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

async function getClinicAvailableTimesTimeWindow(req, res, next) {
    if (!client.connected) { return res.status(502).json({ error: "MQTT client not connected" }) }

    const uuid = uuidv4();
    try {
        const clinics = req.body.clinics;
        const start_time = req.body.start_time;
        const end_time = req.body.end_time;
        const publishTopic = "grp20/req/availabletimes/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            clinics: clinics,
            requestID: uuid,
            start_time: start_time,
            end_time: end_time
        }), (err) => { if (err) { next(err) } });
        mqttTimeout(uuid, 10000);
    }
    catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

module.exports = {
    getDentistAvailableTimes,
    getClinicAvailableTimesTimeWindow
};
