import type { TProductWithImages } from "../types/Product";
import type { TCartItem } from "../store/useCartStore";
import { toPriceNumber } from "../utils/numbers";

const ItemPrice = ({ item }: { item: TCartItem<TProductWithImages> }) => {
    return (
        <>
            {item.product.inventory === 0 ? (
                <>
                    <div className="text-danger fs-4 lh-1">Out of Stock</div>
                    <div>Delete from cart to continue</div>
                </>
            ) : (
                <>
                    <div>
                        {item.product.discount > 0 && (
                            <s className="text-muted fs-5">{`${toPriceNumber(
                                item.amount * item.product.price
                            )} $`}</s>
                        )}
                    </div>
                    <div
                        className={
                            item.product.discount
                                ? "text-danger fs-4 lh-1"
                                : "fs-4 lh-1"
                        }
                    >
                        {`${toPriceNumber(
                            ((100 - item.product.discount) / 100) *
                                item.amount *
                                item.product.price
                        )} $`}
                    </div>
                </>
            )}
        </>
    );
};

export default ItemPrice;
