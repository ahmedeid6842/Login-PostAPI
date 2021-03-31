const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dj2yju5sd",
    api_key: "118986315778499",
    api_secret: "2BBVdNTae_5jcYqog3mqZTE4MZ4"
})


exports.uploads = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({ url: result.url, id: result.public_id })
        }, { resource_type: "auto" })
    })
}
