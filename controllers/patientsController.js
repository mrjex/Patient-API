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
        const patient_id = req.patient.patient_id;
        const publishTopic = "grp20/req/patients/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            _id: patient_id,
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

// Get patients email with matching patientID
async function getPatientEmail(req, res, next) {
    if (!client.connected) {
        return res.status(502).json({error: "MQTT client not connected"})
    }

    const uuid = uuidv4();
    try {
        const patient_id = req.params.patient_id;
        const publishTopic = "grp20/req/patients/get";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            _id: patient_id,
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
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const publishTopic = "grp20/req/patients/create";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            username: username,
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
        const username = req.body.username;
        const password = req.body.password
        const publishTopic = "grp20/req/patients/login";

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            username: username,
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

    const patient_id = req.patient.patient_id;
    const username = req.body.username;
    const email = req.body.email
    const password = req.body.password;

    const uuid = uuidv4();
    try {
        let UpdateInformation = []
        if (username) {
            UpdateInformation.push({username: username})
        }
        if (email) {
            UpdateInformation.push({email: email})
        }
        if (password) {
            UpdateInformation.push({password: password})
        }
        
        const publishTopic = "grp20/req/patients/update";
        console.log(UpdateInformation)
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            UpdateInformation: UpdateInformation,
            patient_id: patient_id,
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
        const patient_id = req.patient.patient_id;
        const publishTopic = "grp20/req/patients/delete"

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({
            patient_id: patient_id,
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
    deletePatient,
    getPatientEmail
};