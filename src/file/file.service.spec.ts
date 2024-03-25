import { Test, TestingModule } from "@nestjs/testing";
import { FileService } from "./file.service";
import { getPhoto } from "../__mocks__/get-photo.mock";

describe('FileService', () => {

    let fileService: FileService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [FileService]
        }).compile();

        fileService = module.get<FileService>(FileService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('FileService be defined', () => {
        expect(fileService).toBeDefined();
    });

    describe('test file service', () => {
        it('upload method', async () => {
            const photo = getPhoto();
            const filename = 'photo-test.png'
            fileService.upload(await photo, filename);
        });

    });

});