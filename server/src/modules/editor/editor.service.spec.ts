import { Test, TestingModule } from "@nestjs/testing";
import { EditorService } from "./editor.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

describe("EditorService", () => {
    let service: EditorService;
    let cloudinaryServiceMock: Partial<CloudinaryService> & {
        upload: jest.Mock;
    };

    beforeEach(async () => {
        cloudinaryServiceMock = {
            upload: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EditorService,
                { provide: CloudinaryService, useValue: cloudinaryServiceMock },
            ],
        }).compile();

        service = module.get<EditorService>(EditorService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("uploadImages", () => {
        const mockFiles = [
            { buffer: Buffer.from("image1") },
            { buffer: Buffer.from("image2") },
        ] as Express.Multer.File[];

        it("should upload and transform multiple images", async () => {
            const mockUploadResponses = [
                { public_id: "image1_id", secure_url: "image1_url" },
                { public_id: "image2_id", secure_url: "image2_url" },
            ];
            cloudinaryServiceMock.upload.mockImplementation((buffer) => {
                const index = mockFiles.findIndex(
                    (file) => file.buffer === buffer,
                );
                return Promise.resolve(mockUploadResponses[index]);
            });

            const result = await service.uploadImages(mockFiles);

            expect(cloudinaryServiceMock.upload).toHaveBeenCalledTimes(2);
            expect(result).toEqual({
                images: [
                    { img_id: "image1_id", img_src: "image1_url" },
                    { img_id: "image2_id", img_src: "image2_url" },
                ],
            });
        });
    });

    describe("uploadSingleImage", () => {
        const mockFile = {
            buffer: Buffer.from("image"),
        } as Express.Multer.File;

        it("should upload and transform a single image", async () => {
            const mockUploadResponse = {
                public_id: "image_id",
                secure_url: "image_url",
            };
            cloudinaryServiceMock.upload.mockImplementation(
                () => mockUploadResponse,
            );

            const result = await service.uploadSingleImage(mockFile);

            expect(cloudinaryServiceMock.upload).toHaveBeenCalledWith(
                mockFile.buffer,
                expect.any(Object),
            );
            expect(result).toEqual({
                image: { img_id: "image_id", img_src: "image_url" },
            });
        });
    });
});
