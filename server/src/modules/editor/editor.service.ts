import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { SingleUploadedImageDto } from "./dto/upload-image.dto";
import { UploadedImagesDto } from "./dto/upload-images.dto";

@Injectable()
export class EditorService {
    async uploadImages(
        imageFiles: Express.Multer.File[],
    ): Promise<UploadedImagesDto> {
        const uploadPromises: Promise<UploadApiResponse>[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
            const uploadPromise = new Promise<UploadApiResponse>(
                (resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            {
                                transformation: [
                                    {
                                        width: 640,
                                        height: 640,
                                        crop: "pad",
                                        fetch_format: "jpg",
                                    },
                                ],
                                folder: "ecommerce-1",
                            },
                            (err, value) => {
                                if (err) reject(err.message);
                                resolve(value);
                            },
                        )
                        .end(imageFiles[i].buffer);
                },
            );
            uploadPromises.push(uploadPromise);
        }
        const cldImages = await Promise.all(uploadPromises);
        const resultImages = cldImages.map((img) => ({
            img_id: img.public_id,
            img_src: img.secure_url,
        }));
        return { images: resultImages };
    }

    async uploadSingleImage(
        imageFile: Express.Multer.File,
    ): Promise<SingleUploadedImageDto> {
        const result = await new Promise<UploadApiResponse>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            transformation: [
                                {
                                    width: 640,
                                    height: 640,
                                    crop: "lfill",
                                    fetch_format: "jpg",
                                },
                                {
                                    fetch_format: "jpg",
                                },
                            ],
                            folder: "ecommerce-1",
                        },
                        (err, value) => {
                            if (err) reject(err.message);
                            resolve(value);
                        },
                    )
                    .end(imageFile.buffer);
            },
        );
        const image = { img_id: result.public_id, img_src: result.secure_url };
        return { image };
    }
}
