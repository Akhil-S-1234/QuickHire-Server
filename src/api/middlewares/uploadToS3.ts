import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

interface CustomRequest extends Request {
  file?: Express.Multer.File;
  Url?: string;
}

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
});

// Set up multer storage (in-memory storage)
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// This middleware will upload files to S3
const uploadToS3 = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void>  => {
  // Ensure a file is uploaded
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return
  }

  console.log(req.file)

  let params: PutObjectCommandInput | undefined;

  if(req.file.fieldname == 'photo') {
     params = {
      Bucket: 'quickhireimg', // Your S3 Bucket
      Key: `images/${Date.now()}-${req.file.originalname}`, // Generate unique key
      Body: req.file.buffer, // File content
      ContentType: req.file.mimetype // MIME type of the file
    };

  } else if (req.file.fieldname == 'resume'){
     params = {
      Bucket: 'quickhireimg', // Your S3 Bucket
      Key: `resumes/${Date.now()}-${req.file.originalname}`, // Generate unique key
      Body: req.file.buffer, // File content
      ContentType: req.file.mimetype // MIME type of the file
    };
  }

  // Check if params is still undefined and return an error if so
  if (!params) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }
 

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    req.Url = `https://${params.Bucket}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${params.Key}`;
    next(); // Move to the next middleware
  } catch (error: any) {
    console.error('Error uploading to S3:', error);
    res.status(500).json({ error: 'Error uploading to S3', message: error.message });
  }
};

export default uploadToS3 ;
