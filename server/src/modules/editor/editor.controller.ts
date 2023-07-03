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
import { ApiBody, ApiConsumes, ApiTags, ApiCookieAuth } from "@nestjs/swagger";
import { UploadedImagesDto } from "./dto/upload-images.dto";
import { SingleUploadedImageDto } from "./dto/upload-image.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { Role } from "@prisma/client";
import { Roles } from "src/common/roles/roles.decorator";
import { RolesGuard } from "src/common/roles/roles.guard";

@ApiTags("editor")
@Controller("editor")
@UseFilters(new ValidationExceptionFilter())
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

    @Post("upload-images")
    @ApiCookieAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                files: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary",
                    },
                },
            },
        },
    })
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
    @ApiCookieAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                files: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary",
                    },
                },
            },
        },
    })
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
