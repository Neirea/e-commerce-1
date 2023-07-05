import { Injectable } from "@nestjs/common";
import {
    UploadApiOptions,
    v2 as cloudinary,
    UploadApiResponse,
} from "cloudinary";

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLDNRY_NAME,
            api_key: process.env.CLDNRY_API_KEY,
            api_secret: process.env.CLDNRY_API_SECRET,
        });
    }

    upload(
        fileBuffer: Buffer,
        options?: UploadApiOptions,
    ): Promise<UploadApiResponse> {
        return new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(options, (err, value) => {
                    if (err) reject(err.message);
                    resolve(value);
                })
                .end(fileBuffer);
        });
    }

    deleteOne(public_id: string): Promise<any> {
        return cloudinary.uploader.destroy(public_id);
    }

    deleteMany(public_ids: string[]): Promise<any> {
        return cloudinary.api.delete_resources(public_ids);
    }
}
