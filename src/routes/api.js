const express = require('express')
const router = express.Router()
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const AuthController = require('../controllers/AuthController')
const FriendController = require('../controllers/FriendController')

let initAPIs = (app) => {
    router
        .post('/login', AuthController.login)
        .post('/refresh-token', AuthController.refreshToken)
    
    // Sử dụng authMiddleware.isAuth trước những api cần xác thực 
    router.use(AuthMiddleware.isAuth)
    // List Protect APIs:
    router
        .get('/friends', FriendController.friendLists)
        // .get('/example-protect-api', ExampleController.someAction)
    
    return app.use('/', router)
}

module.exports = initAPIs