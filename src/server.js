const express = require('express')
const app = express()
require('dotenv').config()
const initAPIs = require('./routes/api')

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// Cho phép các API của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json())

// Khởi tạo các routes cho ứng dụng
initAPIs(app)

// Chọn một port mà bạn muốn và sử dụng để chạy ứng dụng tại local
let port = 8017

app.listen(port, () => {
    console.log(`Hello trungquandev.com, I'm running at http://localhost:${port}/`)
})
