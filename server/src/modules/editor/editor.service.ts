import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import * as path from "node:path";
import { deleteImageFile } from "src/common/delete-imagefile";
import { SingleUploadedImageDto } from "./dto/upload-image.dto";
import { UploadedImagesDto } from "./dto/upload-images.dto";
import { UploadedImage } from "./entities/uploaded-image.entity";

@Injectable()
export class EditorService {
    async uploadImages(
        imageFiles: Express.Multer.File[],
    ): Promise<UploadedImagesDto> {
        const resultImages: UploadedImage[] = [];

        for (let i = 0; i < imageFiles.length; i++) {
            const tempPath = path.resolve(imageFiles[i].path);
            const result = await cloudinary.uploader.upload(tempPath, {
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
            resultImages.push({
                img_id: result.public_id,
                img_src: result.secure_url,
            });
            await deleteImageFile(tempPath, result.public_id);
        }
        return { images: resultImages };
    }

    async uploadSingleImage(
        imageFile: Express.Multer.File,
    ): Promise<SingleUploadedImageDto> {
        const tempPath = path.resolve(imageFile.path);
        const result = await cloudinary.uploader.upload(tempPath, {
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
        await deleteImageFile(tempPath, result.public_id);
        return { image };
    }
}
