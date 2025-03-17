import { Injectable } from "@nestjs/common";
import {
    UploadApiOptions,
    v2 as cloudinary,
    UploadApiResponse,
} from "cloudinary";
import { appConfig } from "src/config/env";

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: appConfig.cldnryName,
            api_key: appConfig.cldnryApiKey,
            api_secret: appConfig.cldnryApiSecret,
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
                    if (!value) {
                        reject("Bad Upload Response");
                        return;
                    }
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
