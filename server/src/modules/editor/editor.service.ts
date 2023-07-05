import { Injectable } from "@nestjs/common";
import { SingleUploadedImageDto } from "./dto/upload-image.dto";
import { UploadedImagesDto } from "./dto/upload-images.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UploadApiResponse } from "cloudinary";

@Injectable()
export class EditorService {
    constructor(private cloudinary: CloudinaryService) {}

    async uploadImages(
        imageFiles: Express.Multer.File[],
    ): Promise<UploadedImagesDto> {
        const uploadPromises: Promise<UploadApiResponse>[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
            const uploadPromise = this.cloudinary.upload(imageFiles[i].buffer, {
                transformation: [
                    {
                        width: 640,
                        height: 640,
                        crop: "pad",
                        fetch_format: "jpg",
                    },
                ],
                folder: "ecommerce-1",
            });
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
        const result = await this.cloudinary.upload(imageFile.buffer, {
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
        });
        const image = { img_id: result.public_id, img_src: result.secure_url };
        return { image };
    }
}
