const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')


/* GET all dentists or a subset of dentists based on clinic. */
async function getDentists(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const clinic_id = req.query.clinic_id
        const publishTopic = "grp20/req/dentists/read";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            clinic_id: clinic_id,
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

/* GET a dentist with dentistID */
async function getDentist(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const dentist_id = req.params.dentist_id
        const publishTopic = "grp20/req/dentists/read";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            _id: dentist_id,
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err);
    }
}

module.exports = {
    getDentists,
    getDentist
};
