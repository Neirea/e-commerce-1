import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { EditorService } from "./editor.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { UploadedImage } from "./editor.types";
import { imgMulterOptions } from "src/config/multer";

@Controller("editor")
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

    @Post("upload-images")
    @UseInterceptors(FilesInterceptor("files", 5, imgMulterOptions))
    uploadImages(
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<{ images: UploadedImage[] }> {
        return this.editorService.uploadImages(files);
    }

    @Post("upload-image")
    @UseInterceptors(FileInterceptor("files", imgMulterOptions))
    uploadSingeImage(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ image: UploadedImage }> {
        return this.editorService.uploadSingleImage(file);
    }
}
