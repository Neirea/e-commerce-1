import { Role } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { Router } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import authorizePermissions from "../middleware/authorizePermissions";
import checkCsrf from "../middleware/checkCsrf";
import isAuthenticated from "../middleware/isAuthenticated";

const router = Router();

interface UploadedImage {
    img_id: string;
    img_src: string;
}

router.post(
    "/upload-images",
    isAuthenticated,
    authorizePermissions([Role.EDITOR]),
    checkCsrf,
    async (req, res) => {
        const imageFiles = req.files?.images as
            | Array<UploadedFile>
            | UploadedFile;
        if (Array.isArray(imageFiles)) {
            if (!imageFiles || !imageFiles.length) {
                res.json({ images: [] });
                return;
            }
            interface UploadedImage {
                img_id: string;
                img_src: string;
            }
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
                    }
                );
                resultImages.push({
                    img_id: result.public_id,
                    img_src: result.secure_url,
                });
                fs.unlinkSync(imageFiles[i].tempFilePath);
            }
            res.status(StatusCodes.OK).json({ images: resultImages });
            return;
        } else {
            if (!imageFiles) {
                res.json({ images: [] });
                return;
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
                }
            );

            resultImages.push({
                img_id: result.public_id,
                img_src: result.secure_url,
            });
            fs.unlinkSync(imageFiles.tempFilePath);
            res.status(StatusCodes.OK).json({ images: resultImages });
        }
    }
);

export default router;
