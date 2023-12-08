const jwt = require('jsonwebtoken');

function generateJWT(patient_id) {
    return jwt.sign({patient_id: patient_id}, process.env.TOKEN_SECRET, {expiresIn: '1800s'})
}

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