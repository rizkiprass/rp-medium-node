// //save to lcoal
// const multer = require('multer');

// // Multer configuration for handling file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Change the 'uploads/' to the desired upload directory
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
//   }
// });

// const upload = multer({ storage: storage });

// // Middleware function for handling file uploads
// const uploadMiddleware = upload.single('image'); // Assuming 'image' is the field name in your form

// module.exports = uploadMiddleware;



//save to s3
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
require('dotenv').config();

// Create an S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer configuration for handling file uploads to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const folderPath = 'images/';
      cb(null, folderPath + file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
    
  }),
});

// Middleware function for handling file uploads
const uploadMiddleware = upload.single('image'); // Assuming 'image' is the field name in your form

module.exports = uploadMiddleware;
