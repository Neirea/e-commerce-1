export type TCompany = {
    id: number;
    name: string;
};

export interface TCompanyFull extends TCompany {
    productCount?: number;
}
