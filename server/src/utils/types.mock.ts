import { CloudinaryService } from "../modules/cloudinary/cloudinary.service.js";
import { PrismaService } from "../modules/prisma/prisma.service.js";
import { Mock } from "vitest";

export type TCloudinaryServiceMock = Partial<CloudinaryService> & {
    upload: Mock;
    deleteOne: Mock;
    deleteMany: Mock;
};

export type TPrismaServiceMock = Partial<PrismaService> & {
    $queryRaw: Mock;
    $transaction: Mock;
    order: { create: Mock; update: Mock };
    product: { create: Mock; update: Mock };
    user: { create: Mock };
};

export type TExpressSessionDestroyMock = (
    arg: string | null,
) => (callback: (err: any) => void) => void;
