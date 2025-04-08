import multer from 'multer'
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  function fileFilter (req, file, cb) {
console.log('File mimetype:', file.mimetype); // Debugging log
    const allowedFiles = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg'];
    if (!allowedFiles.includes(file.mimetype)) {
        console.error('File type not allowed:', file.mimetype); // Debugging log
    cb(new Error('Only images are allowed.'), false);
    } else {
        cb(null, true);
    }
       }
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  export default upload;