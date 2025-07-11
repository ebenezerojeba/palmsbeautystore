// import multer from "multer";

// const storage = multer.diskStorage({
//     filename: function(req,file,callback){
//         callback(null,file.originalname)
//     }
// })

// const upload = multer({storage})

// export default upload


// middleware/upload.js
import multer from "multer";
import path from "path";

// Set destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save to /uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
