import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

type UploadedImage = {
    img_id: string;
    img_src: string;
};

@Injectable()
export class EditorService {
    async uploadImages() {
        // ANY FILE UPLOAD NEW
        // const imageFiles = req.files?.images as
        //     | Array<UploadedFile>
        //     | UploadedFile;
        const imageFiles: any = "yo";
        if (!imageFiles || !imageFiles.length) {
            return { images: [] };
        }
        if (Array.isArray(imageFiles)) {
            const resultImages: Array<UploadedImage> = [];

            for (let i = 0; i < imageFiles.length; i++) {
                const result = await cloudinary.uploader.upload(
                    imageFiles[i].tempFilePath,
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
                // fs.unlinkSync(imageFiles[i].tempFilePath);
            }
            return { images: resultImages };
        }

        const resultImages: Array<UploadedImage> = [];
        const result = await cloudinary.uploader.upload(
            imageFiles.tempFilePath,
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
        );

        resultImages.push({
            img_id: result.public_id,
            img_src: result.secure_url,
        });
        // fs.unlinkSync(imageFiles.tempFilePath);
        return { images: resultImages };
    }
}
