const {v4: uuidv4} = require('uuid');
const {mqttTimeout, responseMap, client} = require("./utils")


/* GET all dentists or a subset of dentists based on clinic. */
async function getDentists(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const clinic = req.query.clinic
        const publishTopic = "grp20/req/dentists/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            clinic: clinic,
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
        const dentistID = req.params.dentistID
        const publishTopic = "grp20/req/dentists/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            dentistID: dentistID,
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
