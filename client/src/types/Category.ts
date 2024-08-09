export type TCategory = {
    id: number;
    name: string;
    img_id?: string;
    img_src?: string;
    parent_id?: number;
};

export type TUploadedImage = {
    img_id: string;
    img_src: string;
};

export type TCategoryFull = TCategory & { productCount?: number } & {
    parent?: TCategory | null;
};
