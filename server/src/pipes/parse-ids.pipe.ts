import { ParseArrayPipe } from "@nestjs/common";

export class ParseQuaryArrayPipe extends ParseArrayPipe {
    constructor() {
        super({
            optional: true,
            items: Number,
            separator: ",",
        });
    }
}
