import { Test, TestingModule } from "@nestjs/testing";
import { EditorService } from "./editor.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { TCloudinaryServiceMock } from "src/utils/types.mock";

describe("EditorService", () => {
    let service: EditorService;
    let cloudinaryService: TCloudinaryServiceMock;

    beforeEach(async () => {
        const cloudinaryMock = {
            upload: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EditorService,
                { provide: CloudinaryService, useValue: cloudinaryMock },
            ],
        }).compile();

        service = module.get<EditorService>(EditorService);
        cloudinaryService =
            module.get<TCloudinaryServiceMock>(CloudinaryService);
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
            cloudinaryService.upload.mockImplementation((buffer) => {
                const index = mockFiles.findIndex(
                    (file) => file.buffer === buffer,
                );
                return Promise.resolve(mockUploadResponses[index]);
            });

            const result = await service.uploadImages(mockFiles);

            expect(cloudinaryService.upload).toHaveBeenCalledTimes(2);
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
            cloudinaryService.upload.mockImplementation(
                () => mockUploadResponse,
            );

            const result = await service.uploadSingleImage(mockFile);

            expect(cloudinaryService.upload).toHaveBeenCalledWith(
                mockFile.buffer,
                expect.any(Object),
            );
            expect(result).toEqual({
                image: { img_id: "image_id", img_src: "image_url" },
            });
        });
    });
});
