import { ParseArrayPipe } from "@nestjs/common";

export class ParseQuaryArrayPipe extends ParseArrayPipe {
    constructor() {
        super({
            items: Number,
            separator: ",",
        });
    }
}
