const debug = console.log.bind(console)

let friendLists = (req, res) => {
    debug(`Xác thực token hợp lệ, thực hiện giả lập lấy danh sách bạn bè của user và trả về cho người dùng`)
    // Lưu ý trong thực tế thì việc lấy danh sách này là query tới DB.
    // Đây chỉ là mock dữ liệu
    const friends = [
        {
            name: 'Cat: Russian Blue',
        },
        {
            name: 'Cat: Maine Coon',
        },
        {
            name: 'Cat: Balinese',
        },
        {
            name: 'Cat: Countryside Vina',
        },
    ]
    return res.status(200).json(friends)
}

module.exports = {
    friendLists: friendLists,
}