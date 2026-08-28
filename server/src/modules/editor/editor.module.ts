import { Module } from "@nestjs/common";
import { EditorService } from "./editor.service.js";
import { EditorController } from "./editor.controller.js";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";

@Module({
    controllers: [EditorController],
    providers: [EditorService, CloudinaryService],
})
export class EditorModule {}
