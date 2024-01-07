class testMQTTclient {
    constructor() {
        this.messageHandler = null
        this.connected = true
    }

    publish(topic, message, callback) {
        console.log('Received message in testMQTTclient')

        process.nextTick(() => {
            try {
                if (this.messageHandler) {
                    topic = topic.replace('req', 'res')
                    let messageobj = JSON.parse(message)
                    messageobj.status = 200
                    messageobj = amendTestData(topic, messageobj)
                    message = JSON.stringify(messageobj)
                    this.messageHandler(topic, message)
                }
                if (callback) {
                    callback(null)
                }
            } catch (err) {
                console.error(err)
            }
        })
    }
    on(event, handler) {
        if (event === 'message') {
            this.messageHandler = handler
        }
    }
}
function amendTestData(topic, message) {
    if (topic.includes('dentist')) {
        message.dentist = 'testdentist'
        return message
    }
    if (topic.includes('patient')) {
        message.patient = 'testpatient'
        return message
    }
    if (topic.includes('clinic')) {
        message.clinic = 'testclinic'
        return message
    }
    if (topic.includes('map')) {
        message.clinic = 'testclinic'
        return message
    }
    if (topic.includes('timeslots')) {
        message.appointment = 'testappointment'
        return message
    }
    if (topic.includes('availabletimes')) {
        message.appointment = 'testappointment'
        return message
    }
    if (topic.includes('appointment')) {
        message.appointment = 'testappointment'
        return message
    }
    if (topic.includes('subscriber')) {
        message.patient = 'testPatient'
        return message
    }
    if (topic.includes('notification')) {
        message.patient = 'testPatient'
        return message
    }
}

module.exports = new testMQTTclient()