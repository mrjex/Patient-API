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

const subscribeTopic = "grp20/res/timeSlots/+";
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

/* GET timeslots with matching dentist ID.*/
async function getDentistTimeslots(req, res, next) {
    try {
        const dentistID = req.params.dentistID;
        const publishTopic = "grp20/req/timeSlots/get/"
        const uuid = uuidv4();
        responseMap.set(uuid, res);
        client.publish(publishTopic, JSON.stringify({ dentistID: dentistID, requestID: uuid }));
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    getDentistTimeslots
  };
