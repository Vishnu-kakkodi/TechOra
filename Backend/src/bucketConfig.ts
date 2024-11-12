// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import multer, { Multer } from 'multer';
// import multerS3 from 'multer-s3';
// import dotenv from 'dotenv';
// import { NextFunction, Response } from 'express';
// import { Request } from 'express';

// dotenv.config();

// // Validate required environment variables
// const requiredEnvVars = [
//   'AWS_ACCESS_KEY_ID',
//   'AWS_SECRET_ACCESS_KEY',
//   'AWS_S3_BUCKET_NAME'
// ] as const;

// requiredEnvVars.forEach(varName => {
//   if (!process.env[varName]) {
//     throw new Error(`Missing required environment variable: ${varName}`);
//   }
// });

// const s3 = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   }
// });

// const upload: Multer = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_S3_BUCKET_NAME!,
//     metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
//       cb(null, {
//         fieldName: file.fieldname,
//         contentType: file.mimetype
//       });
//     },
//     key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
//       const fileType = req.body.fileType as string; 
//       let folderPath: string;

//       switch (fileType) {
//         case 'user_profile':
//           folderPath = 'user_profiles';
//           break;
//         case 'institution_video':
//           folderPath = 'institution_videos';
//           break;
//           case 'course_thumpnail':
//             folderPath = 'course_thumpnail';
//             break;
//         case 'institution_document':
//           folderPath = 'institution_documents';
//           break;
//         case 'quiz':
//           folderPath = 'quizzes';
//           break;
//         default:
//           folderPath = 'other_files';
//       }

//       const fileName = `${folderPath}/${new Date().getFullYear()}/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
//       cb(null, fileName);
//     },
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//   }),
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//     files: 1 
//   },
//   fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF files are allowed'));
//     }
//   },
// });

// export default upload;





import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer, { Multer } from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import { NextFunction, Response, Request } from 'express';

dotenv.config();

const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET_NAME'
] as const;

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
const allowedDocumentTypes = ['application/pdf'];

const upload: Multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
      cb(null, {
        fieldName: file.fieldname,
        contentType: file.mimetype
      });
    },
    key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
      let folderPath: string;
      console.log("Haiiiii");
      switch (file.fieldname) {
        case 'thumbnail':
          folderPath = 'course_thumbnails';
          break;
        case 'profileImage':
          folderPath = 'user_profiles';
          break;
        case 'video':
          folderPath = 'institution_videos';
          break;
        case 'document':
          folderPath = 'institution_documents';
          break;
        default:
          folderPath = 'other_files';
      }

      const fileName = `${folderPath}/${new Date().getFullYear()}/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      cb(null, fileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'thumbnail') {
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, and GIF files are allowed for thumbnails'));
      }
    } else if (file.fieldname === 'document') {
      if (allowedDocumentTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for documents'));
      }
    } else {
      cb(null, true);
    }
  },
});

export default upload;