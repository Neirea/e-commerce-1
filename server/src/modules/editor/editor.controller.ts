import { Controller, Post } from "@nestjs/common";
import { EditorService } from "./editor.service";

@Controller("editor")
export class EditorController {
    constructor(private readonly editorService: EditorService) {}

    @Post("/upload-images")
    uploadImages() {
        return this.editorService.uploadImages();
    }
}
