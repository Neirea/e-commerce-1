import { Injectable } from "@nestjs/common";
import { RedisClientType, createClient } from "redis";

@Injectable()
export class RedisService {
    readonly redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient({
            url: process.env.REDIS_URL,
            pingInterval: 200_000,
        });
        this.redisClient.on("error", console.error);
    }
}
