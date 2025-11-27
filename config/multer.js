const multer = require('multer');
const path = require('path');
const fs = require('fs');

class FileUploadConfig {
    constructor() {
        this.uploadsDir = path.join(__dirname, '..', 'uploads');
        this.ensureUploadsDirectory();
    }

    ensureUploadsDirectory() {
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    getStorage(subfolder = '') {
        const destination = subfolder 
            ? path.join(this.uploadsDir, subfolder)
            : this.uploadsDir;

        // Ensure subfolder exists
        if (subfolder && !fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, destination);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
        });
    }

    getFileFilter(allowedTypes = []) {
        return (req, file, cb) => {
            if (allowedTypes.length === 0) {
                cb(null, true);
            } else {
                const fileExtension = path.extname(file.originalname).toLowerCase();
                if (allowedTypes.includes(fileExtension)) {
                    cb(null, true);
                } else {
                    cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed!`), false);
                }
            }
        };
    }

    createUploader(options = {}) {
        const {
            subfolder = '',
            allowedTypes = [],
            maxSize = 5 * 1024 * 1024, // 5MB default
            maxFiles = 1
        } = options;

        return multer({
            storage: this.getStorage(subfolder),
            fileFilter: this.getFileFilter(allowedTypes),
            limits: {
                fileSize: maxSize,
                files: maxFiles
            }
        });
    }
}

module.exports = new FileUploadConfig();