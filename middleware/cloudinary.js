const cloudinary = require('cloudinary');
const config = require('config');

cloudinary.config({
    cloud_name: "dj2yju5sd",
    api_key: config.get("cloudKey"),
    api_secret:config.get('cloudSecret'),
})

exports.upload = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({ url: result.url, id: result.public_id })
        }, { resource_type: "auto" })
    })
}