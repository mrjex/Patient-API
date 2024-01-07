const mqtt = require("mqtt");
const { messageHandlers } = require('./messageHandlers');
const mockMqttClient = require('./test/testMQTTclient');


const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT
};
const client = process.env.TEST_MODE ? mockMqttClient: mqtt.connect(mqttOptions);

//Generates a list of topics for the MQTT client from messageHandlers keys.
const subscribeTopics = Object.keys(messageHandlers).map(topic => topic + '+');

/*Handles received messages, if the topic matches a key in messageHandler it calls the 
corresponding function*/
client.on("message", (topic, message) => {
    try {
        const messageJson = JSON.parse(message.toString());
        for (const key in messageHandlers) {
            if (topic.startsWith(key)) {
                messageHandlers[key](client, messageJson, topic);
                break;
            }
        }
    } catch (err) {
        console.error("messageCallback:", err.message);
    }
});

client.on("connect", () => {
    console.log("Succesfully connected to broker");
    client.subscribe(subscribeTopics);
});

client.on("reconnect", () => {
    console.log("Reconnecting to broker...");
});

client.on("error", (error) => {
    console.error(error);
});

client.on("close", () => {
    console.log("Disconnected from broker");
});

module.exports = {
    client
};