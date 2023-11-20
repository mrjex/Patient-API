const mqtt = require("mqtt");
const { v4: uuidv4 } = require('uuid');

const mqttOptions = {
    host: 'placeholder',
    port: 'placeholder',
    protocol: 'placeholder',
    username: 'placeholder',
    password: 'placeholder'
};
const client = mqtt.connect(mqttOptions);



const responseMap = new Map();

const subscribeTopic = "grp20/res/appointments/+";
client.subscribe(subscribeTopic);

/*Handles received messages */
client.on("message", (topic, message) => {
    const messageJson = JSON.parse(message.toString());
    if (messageJson.hasOwnProperty("requestID")) {
        const res = responseMap.get(messageJson.requestID)
        res.json(messageJson);
        responseMap.delete(messageJson.requestID);
    }
})

/* GET appointments with matching patientID. */
async function getUsersAppointments(req, res, next) {
    try {
        const patientID = req.params.patientID;
        const publishTopic = "grp20/req/appointments/get";
        const uuid = uuidv4();

        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({ patientID: patientID, requestID: uuid }));
    }
    catch (err) {
        next(err);
    }
}
/* POST appointment using a patientID and appointmentID*/
async function createAppointment(req, res, next) {
    try {
        const appointmentID = req.body.appointmentID;
        const patientID = req.body.patientID;
        const publishTopic = "grp20/req/appointments/post/"
        const uuid = uuidv4();
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({ appointmentID: appointmentID, patientID: patientID, requestID: uuid}));
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    getUsersAppointments,
    createAppointment,
  };
