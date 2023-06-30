import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import { UploadedImage } from "./editor.types";

@Injectable()
export class EditorService {
    async uploadImages(
        imageFiles: Express.Multer.File[],
    ): Promise<{ images: UploadedImage[] }> {
        if (!imageFiles || !imageFiles.length) {
            return { images: [] };
        }
        const resultImages: UploadedImage[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
            const result = await cloudinary.uploader.upload(
                imageFiles[i].path,
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
            );
            resultImages.push({
                img_id: result.public_id,
                img_src: result.secure_url,
            });
            fs.unlinkSync(imageFiles[i].path);
        }
        return { images: resultImages };
    }

    async uploadSingleImage(
        imageFile: Express.Multer.File,
    ): Promise<{ image: UploadedImage }> {
        const result = await cloudinary.uploader.upload(imageFile.path, {
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
        fs.unlinkSync(imageFile.path);
        return { image };
    }
}
