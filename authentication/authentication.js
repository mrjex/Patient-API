const jwt = require('jsonwebtoken');

/*
Authentication inspired by https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs 
*/

/*
This function generates a JWT from TOKEN_SECRET in .env, and sets an expiry date.
The token contains the patient_id*/
function generateJWT(patient_id) {
    return jwt.sign({patient_id: patient_id}, process.env.TOKEN_SECRET, {expiresIn: '1800s'})
}
/* This function can be used as a express middleware, it verifies token present in Authorization header
and attaches the contained patient to the req object.
Failed verification results in a 403 or 401 response*/
function authenticateJWT(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, patient) => {
        if(err) {
            return res.status(403).json({error: 'Authentication failed'})
        }
        req.patient = patient;

        next()
    })
}

module.exports = {generateJWT, authenticateJWT}