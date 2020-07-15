// const multer = require('multer');

// const fileStorage = multer.diskStorage({
//     destination: 'images',
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === 'image/png' ||
//         file.mimetype === 'image/jpg' ||
//         file.mimetype === 'image/jpeg'
//     ) {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }

// module.exports = multer({ storage: fileStorage, fileFilter: fileFilter }).any();

const multer = require('multer')

// stores file on disk
const fileStorage = multer.diskStorage({
    destination: 'images',
    filename : (req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const fileFilter = (req,file,cb) =>{
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null,true)
    } else{
        cb(null,false)
    }
}

module.exports = multer({storage: fileStorage,fileFilter:fileFilter}).any()