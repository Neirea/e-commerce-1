import { CreateProductDto } from "../dto/create-propduct.dto";
import { PrismaService } from "src/modules/prisma/prisma.service";

export const createProduct = async (
    prisma: PrismaService,
    input: CreateProductDto,
) => {
    //any
    // if (!req.session.user?.role.includes(Role.EDITOR)) {
    //     throw new AuthenticationError(
    //         "You don't have permissions for this action"
    //     );
    // }
    const { variants, img_id, img_src, ...createData } = input;
    // if (input.name.length < 3) throw new UserInputError("Name is too short");

    //create product, create product images and connection to variants
    const connectArr = variants?.map((p_id) => {
        return { id: p_id };
    });
    const productImages = img_id.map((img, i) => {
        return { img_id: img, img_src: img_src[i] };
    });

    // connects variants many-to-many on creation
    const createProduct = prisma.product.create({
        data: {
            ...createData,
            images: {
                create: productImages,
            },
            variants: {
                connect: connectArr,
            },
            variantsRelation: {
                connect: connectArr,
            },
        },
    });
    //create connection between company and category
    const updateCategory = prisma.$queryRaw`
        INSERT INTO public."_CategoryToCompany" ("A","B")
        VALUES (${input.category_id},${input.company_id})
        ON CONFLICT DO NOTHING
    `;

    await Promise.all([createProduct, updateCategory]);
    return true;
};
