const jwtHelper = require('../helpers/jwt.helper')
const debug = console.log.bind(console)

// Biến cục bộ trên server sẽ lưu trữ tạm danh sách token 
// Trong thực tế thì lưu vào chỗ khác, Redis | Database
let tokenList = {}

// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// Thời gian sống của refresh token
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

/**
 * Controller login
 * @param {*} req 
 * @param {*} res 
 */
let login = async (req, res) => {
    try {
        debug(`Đang giả định hành động đăng nhập thành công với Email và Password`)
        debug(`Thực hiện fake thông tin user...`)
        const userFakeData = {
            _id: '1234-5678-910JQK-tqd',
            name: 'Trung Quân',
            email: req.body.email,
        }
        debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ]`)
        const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife)
        
        debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm]`)
        const refreshToken = await jwtHelper.generateToken(userFakeData, refreshTokenSecret, refreshTokenLife)

        // Lưu lại 2 mã access và refresh token với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên
        // Lưu ý trong thực tế lưu chỗ khác, Redis | Database
        tokenList[refreshToken] = { accessToken, refreshToken }

        debug(`Gửi Token và Refresh Token về cho client...`)
        return res.status(200).json({ accessToken, refreshToken })
    } catch (err) {
        return res.status(500).json(err)
    }
}

/**
 * Controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
let refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken
    // debug('TokenList: ', tokenList)

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // verify kiểm tra tính hợp lệ của refreshToken và lấy dữ liệu giải mã decoded
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret)
            
            // Thông tin user lúc này có thể lấy thông qua biến decoded.data
            // Có thể mở comment dòng debug bên dưới để xem
            // debug('decoded: ', decoded)
            const userFakeData = decoded.data

            debug(`Thực hiện mã token trong bước gọi refresh token, [thời gian sống vẫn là 1 giờ]`)
            const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife)

            // Gửi token mới về cho người dùng
            return res.status(200).json({ accessToken })
        } catch (err) {
            // Lưu ý trong thực tế bỏ dòng debug bên dưới
            debug(err)
            res.status(403).json({
                message: 'Invalid refresh token'
            })
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided'
        })
    }
}

module.exports = {
    login: login,
    refreshToken: refreshToken,
}