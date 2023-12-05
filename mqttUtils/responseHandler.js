/*This map is responsible for storing res objects with a unique identifier as the key */
const responseMap = new Map();

async function sendResponse(message) {
    try {
        if (message.hasOwnProperty("requestID")) {
            const res = responseMap.get(message.requestID);

            if (res) {
                //Checks if the message contains a status code
                if (message.hasOwnProperty("status")) {

                    //Sends response with the provided status code & error message
                    res.status(parseInt(message.status)).json({ error: message.error, })
                } else {
                    res.json(message);
                }
                responseMap.delete(message.requestID);
            } else { console.error("Response object not found for requestID: " + message.requestID) }
        }
    }
    catch (err) {
        console.log(err.message);
    }

}

module.exports = {
    responseMap,
    sendResponse
}