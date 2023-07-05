import { Module } from "@nestjs/common";
import { EditorService } from "./editor.service";
import { EditorController } from "./editor.controller";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Module({
    controllers: [EditorController],
    providers: [EditorService, CloudinaryService],
})
export class EditorModule {}
