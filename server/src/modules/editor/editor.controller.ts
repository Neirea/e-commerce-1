import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { EditorService } from "./editor.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedImage } from "./editor.types";

@Controller("editor")
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

    @Post("upload-images")
    @UseInterceptors(FileInterceptor("files"))
    uploadImages(
        @UploadedFile() files: Express.Multer.File[],
    ): Promise<{ images: UploadedImage[] }> {
        return this.editorService.uploadImages(files);
    }

    @Post("upload-image")
    @UseInterceptors(FileInterceptor("files"))
    uploadSingeImage(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ image: UploadedImage }> {
        return this.editorService.uploadSingleImage(file);
    }
}
