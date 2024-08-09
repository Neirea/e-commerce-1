export type TCompany = {
    id: number;
    name: string;
};

export type TCompanyFull = TCompany & { productCount?: number };
