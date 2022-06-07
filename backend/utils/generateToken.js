const jwt =require('jsonwebtoken')

const generateToken = (id) =>{
    return jwt.sign({id}, "b4560283a9d3073bca8a", {
        expiresIn: '30d'
    })
}

module.exports = generateToken