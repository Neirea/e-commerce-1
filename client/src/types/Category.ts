import { ICompany } from "./Company";

export type ICategory = {
    id: number;
    name: string;
    img_id?: string;
    img_src?: string;
    parent_id?: number;
};

export type IUploadedImage = {
    img_id: string;
    img_src: string;
};

export type ICategoryType = ICategory & { productCount?: number } & {
    parent?: ICategory | null;
};
