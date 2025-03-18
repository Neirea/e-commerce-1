import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { IUpsertCategoryRequest } from "./category.types";

@Catch()
export class SingleUploadFilter implements ExceptionFilter {
    constructor(private cloudinary: CloudinaryService) {}

    async catch(
        exception: BadRequestException,
        host: ArgumentsHost,
    ): Promise<void> {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<IUpsertCategoryRequest>();
        const response = ctx.getResponse<Response>();
        const img_id = request.body?.img_id;

        if (img_id) {
            await this.cloudinary.deleteOne(img_id);
        }

        response.status(400).json({
            statusCode: 400,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
        });
    }
}
