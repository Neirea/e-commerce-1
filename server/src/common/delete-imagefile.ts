import * as fs from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";

export const deleteImageFile = async (path: string, img_id: string) => {
    try {
        await fs.unlink(path);
    } catch (error) {
        await cloudinary.uploader.destroy(img_id);
        throw error;
    }
};
