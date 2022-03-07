const jwtHelper = require('../helpers/jwt.helper')
const debug = console.log.bind(console)

// Mã secretKey này phải được bảo mật tuyệt đối, có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

let isAuth = async (req, res, next) => {
    // Lấy token được gửi lên từ phía client, thông thường tốt nhất là truyền token vào header
    const tokenFromClient = req.body.token || req.query.token || req.headers['x-access-token']
    if (tokenFromClient) {
        // Nếu tồn tại token
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret)

            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau
            req.jwtDecoded = decoded
            
            // Cho phép req đi tiếp sang controller
            next()
        } catch (err) {
            // Nếu giải mã gặp lỗi: Không đúng | Hết hạn | ..etc:
            // Lưu ý trong dự án thực tế không sử dụng dòng debug bên dưới
            debug('Error while verify token', err)
            return res.status(401).json({
                message: 'Unauthorized',
            })
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        })
    }
}

module.exports = {
    isAuth: isAuth,
}