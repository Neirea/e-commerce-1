import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { appConfig } from "src/config/env";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: appConfig.databaseUrl,
        });
        super({ adapter });
    }
    async onModuleInit(): Promise<void> {
        await this.$connect();
    }
}
