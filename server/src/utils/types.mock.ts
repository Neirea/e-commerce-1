import { CloudinaryService } from "src/modules/cloudinary/cloudinary.service";
import { PrismaService } from "src/modules/prisma/prisma.service";

export type TPrismaServiceMock = Partial<PrismaService> & {
    $queryRaw: jest.Mock;
    $transaction: jest.Mock;
    order: { create: jest.Mock; update: jest.Mock };
    product: { create: jest.Mock; update: jest.Mock };
    user: { create: jest.Mock };
};

export type TCloudinaryServiceMock = Partial<CloudinaryService> & {
    upload: jest.Mock;
    deleteOne: jest.Mock;
    deleteMany: jest.Mock;
};

export type TExpressSessionDestroyMock = (
    arg: string | null,
) => (callback: (err: any) => void) => void;
