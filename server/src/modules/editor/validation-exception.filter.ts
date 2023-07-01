import {
    Catch,
    ArgumentsHost,
    BadRequestException,
    ExceptionFilter,
} from "@nestjs/common";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Request, Response } from "express";

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        // delete temp images
        if (request.files) {
            const keys = Object.keys(request.files);
            keys.forEach((key) => {
                const filePath = path.resolve(request.files[key].path);
                fs.unlink(filePath);
            });
        }
        if (request.file) {
            const filePath = path.resolve(request.file.path);
            fs.unlink(filePath);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
        });
    }
}
