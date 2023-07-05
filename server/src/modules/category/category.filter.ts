import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Catch()
export class SingleUploadFilter implements ExceptionFilter {
    constructor(private cloudinary: CloudinaryService) {}

    catch(exception: BadRequestException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const img_id = request.body?.img_id;

        if (img_id) {
            this.cloudinary.deleteOne(img_id);
        }

        response.status(400).json({
            statusCode: 400,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
        });
    }
}
