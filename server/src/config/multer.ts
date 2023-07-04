import { memoryStorage } from "multer";

export const imgMulterOptions = {
    storage: memoryStorage(),
};
