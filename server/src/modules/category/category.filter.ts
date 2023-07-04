import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

@Catch()
export class SingleUploadFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const img_id = request.body?.img_id;

        if (img_id) {
            cloudinary.uploader.destroy(img_id);
        }

        response.status(400).json({
            statusCode: 400,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
        });
    }
}
