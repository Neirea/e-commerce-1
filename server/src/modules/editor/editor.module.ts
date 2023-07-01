import { Module } from "@nestjs/common";
import { EditorService } from "./editor.service";
import { EditorController } from "./editor.controller";

@Module({
    controllers: [EditorController],
    providers: [EditorService],
})
export class EditorModule {}
