import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { s3 } from "../../config/s3.js";

export async function uploadToS3(localFilePath, fileName, mimetype) {
    try {
        const file = fs.createReadStream(localFilePath);
        
        const timestamp = Date.now();
        const key = `upload/${timestamp}-${fileName}`;
    
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key, 
            Body: file,
            ContentType: mimetype,
        });
        
        await s3.send(command);
    
        fs.unlinkSync(localFilePath);
        
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        
    } catch(err) {
        console.error(err);
        throw err; 
    }
}