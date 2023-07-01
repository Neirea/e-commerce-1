import { diskStorage } from "multer";

export const imgMulterOptions = {
    storage: diskStorage({
        destination: "uploads",
    }),
};
