import {
    Controller,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { EditorService } from "./editor.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { imgMulterOptions } from "src/config/multer";
import {
    ApiBody,
    ApiConsumes,
    ApiTags,
    ApiCookieAuth,
    ApiOperation,
} from "@nestjs/swagger";
import { UploadedImagesDto } from "./dto/upload-images.dto";
import { SingleUploadedImageDto } from "./dto/upload-image.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { Role } from "src/database/generated/client";
import { Roles } from "src/common/roles/roles.decorator";
import { RolesGuard } from "src/common/roles/roles.guard";

@ApiTags("editor")
@Controller("editor")
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

    @Post("upload-images")
    @ApiOperation({ summary: "Uploads up to 5 image files" })
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
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    @UseInterceptors(FilesInterceptor("files", 5, imgMulterOptions))
    uploadImages(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 5242880 })],
            }),
        )
        files: Express.Multer.File[],
    ): Promise<UploadedImagesDto> {
        return this.editorService.uploadImages(files);
    }

    @Post("upload-image")
    @ApiOperation({ summary: "Uploads single image file" })
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
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor("files", imgMulterOptions))
    uploadSingeImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 5242880 })],
            }),
        )
        file: Express.Multer.File,
    ): Promise<SingleUploadedImageDto> {
        return this.editorService.uploadSingleImage(file);
    }
}
