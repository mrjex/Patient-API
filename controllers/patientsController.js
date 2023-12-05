const { v4: uuidv4 } = require('uuid');
const { client } = require("../mqttUtils/MQTTclient");
const { responseMap } = require('../mqttUtils/responseHandler')
const { mqttTimeout } = require('../mqttUtils/requestUtils')

// Get patients with matching patientID
async function getPatient(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const patientID = req.params.patientID;
        const publishTopic = "grp20/req/patients/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            patientID: patientID,
            requestID: uuid,
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

// Create patient with information from form.
async function createPatient(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const name = req.body.name;
        const ssn = req.body.ssn;
        const email = req.body.email;
        const password = req.body.password
        const publishTopic = "grp20/req/patients/create";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            name: name,
            ssn: ssn,
            email: email,
            password: password,
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

// Login patient with account credentials.
async function loginPatient(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const email = req.body.email;
        const password = req.body.password
        const publishTopic = "grp20/req/patients/login";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            email: email,
            password: password,
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

// Update patient information
async function updatePatient(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const patientID = req.params.patientID;
    const ssn = req.body.ssn;
    const email = req.body.email;
    const name = req.body.name;

    const uuid = uuidv4();
    try {
        let UpdateInformation = []
        if (name) {
            payload.push({name: name})
        }
        if (ssn) {
            payload.push({ssn: ssn})
        }
        if (email) {
            payload.push({email: email})
        }

        const publishTopic = "grp20/req/patients/update";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            UpdateInformation: UpdateInformation,
            patientID: patientID,
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

// Delete patient with patientID
async function deletePatient(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const patientID = req.params.patientID;
        const publishTopic = "grp20/req/patients/delete/"

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            patientID: patientID,
            requestID: uuid
        }), (err) => {
            if (err) {
                next(err)
            }
        });
        await mqttTimeout(uuid, 10000)
    } catch (err) {
        responseMap.delete(uuid);
        next(err)
    }
}

module.exports = {
    getPatient,
    createPatient,
    loginPatient,
    updatePatient,
    deletePatient
};