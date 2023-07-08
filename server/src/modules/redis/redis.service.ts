import { Injectable } from "@nestjs/common";
import { RedisClientType, createClient } from "redis";
import { appConfig } from "src/config/env";

@Injectable()
export class RedisService {
    readonly redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient({
            url: appConfig.redisUrl,
            pingInterval: 200_000,
        });
        this.redisClient.on("error", console.error);
    }
}
