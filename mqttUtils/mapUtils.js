//This map stores appointments awaiting additional dentist information, requestID is used as the key.
const appointmentsMap = new Map();
/*This map stores a mapping between a dentistRequestID and a requestID, 
this is used to easily find dentistGetRequests sent through getDentistInfo function*/
const dentistRequestIDToRequestID = new Map();

module.exports = {
    appointmentsMap,
    dentistRequestIDToRequestID
}