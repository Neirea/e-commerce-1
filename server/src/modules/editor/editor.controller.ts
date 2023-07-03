import {
    Controller,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseFilters,
    UseInterceptors,
} from "@nestjs/common";
import { EditorService } from "./editor.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { imgMulterOptions } from "src/config/multer";
import { ValidationExceptionFilter } from "./validation-exception.filter";
import { UploadedImagesDto } from "./dto/upload-images.dto";
import { SingleUploadedImageDto } from "./dto/upload-image.dto";

@Controller("editor")
@UseFilters(new ValidationExceptionFilter())
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

    @Post("upload-images")
    @UseInterceptors(FilesInterceptor("files", 5, imgMulterOptions))
    uploadImages(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 5000 })],
            }),
        )
        files: Express.Multer.File[],
    ): Promise<UploadedImagesDto> {
        return this.editorService.uploadImages(files);
    }

    @Post("upload-image")
    @UseInterceptors(FileInterceptor("files", imgMulterOptions))
    uploadSingeImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 5000 })],
            }),
        )
        file: Express.Multer.File,
    ): Promise<SingleUploadedImageDto> {
        return this.editorService.uploadSingleImage(file);
    }
}
