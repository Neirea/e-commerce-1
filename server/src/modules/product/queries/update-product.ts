import { ProductImage } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { UpdateProductDto } from "../dto/update-product.dto";

export const updateProduct = async (
    prisma: PrismaService,
    id: number,
    input: UpdateProductDto,
) => {
    const { variants, img_id, img_src, ...updateData } = input;
    // if (!req.session.user?.role.includes(Role.EDITOR)) {
    //     throw new AuthenticationError(
    //         "You don't have permissions for this action",
    //     );
    // }
    // if (input.name.length < 3) throw new UserInputError("Name is too short");

    //update product, create product images and connection to variants
    const newVariants = variants?.map((p_id) => {
        return { id: p_id };
    });
    const newProductImages = img_id.map((img, i) => {
        return { img_id: img, img_src: img_src[i] };
    });

    const productUpdate = prisma.product.update({
        where: { id: id },
        data: {
            ...updateData,
            images: {
                create: newProductImages,
            },
            variants: {
                connect: newVariants,
            },
            variantsRelation: {
                connect: newVariants,
            },
        },
    });

    //update relationbetween company and category
    const categoryUpdate = prisma.$queryRaw`
        INSERT INTO public."_CategoryToCompany" ("A","B")
        VALUES (${input.category_id},${input.company_id})
        ON CONFLICT DO NOTHING
    `;

    //delete old images
    if (img_id.length) {
        const oldImages = await prisma.$queryRaw<ProductImage[]>`
            SELECT * FROM public."ProductImage"
            WHERE product_id = ${id}
        `;
        prisma.$queryRaw`
            DELETE FROM public."ProductImage"
            WHERE product_id = ${id}
        `;
        cloudinary.api.delete_resources(oldImages.map((i) => i.img_id));
    }

    const promiseArray = [productUpdate, categoryUpdate];
    await Promise.all(promiseArray);

    return true;
};
