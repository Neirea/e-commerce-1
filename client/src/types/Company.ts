export type ICompany = {
    id: number;
    name: string;
};

export type ICompanyType = ICompany & { productCount?: number };