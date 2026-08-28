import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service.js";

@Module({ providers: [CloudinaryService] })
export class CloudinaryModule {}
