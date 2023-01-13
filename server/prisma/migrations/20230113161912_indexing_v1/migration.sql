-- CreateIndex
CREATE INDEX "Category_parent_id_idx" ON "Category" USING HASH ("parent_id");

-- CreateIndex
CREATE INDEX "Order_user_id_idx" ON "Order" USING HASH ("user_id");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Product_inventory_idx" ON "Product"("inventory");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- CreateIndex
CREATE INDEX "Product_discount_idx" ON "Product"("discount");

-- CreateIndex
CREATE INDEX "Product_company_id_idx" ON "Product" USING HASH ("company_id");

-- CreateIndex
CREATE INDEX "Product_category_id_idx" ON "Product" USING HASH ("category_id");

-- CreateIndex
CREATE INDEX "ProductImage_product_id_idx" ON "ProductImage" USING HASH ("product_id");

-- CreateIndex
CREATE INDEX "SingleOrderItem_order_id_idx" ON "SingleOrderItem" USING HASH ("order_id");

-- CreateIndex
CREATE INDEX "SingleOrderItem_product_id_idx" ON "SingleOrderItem" USING HASH ("product_id");

-- Create Search Index
CREATE INDEX "Product_name_idx" ON "Product" USING GIN (to_tsvector('english', "name"));

-- Create Search Index
CREATE INDEX "Company_name_idx" ON "Company" USING GIN (to_tsvector('english', "name"));

-- Create Search Index
CREATE INDEX "Category_name_idx" ON "Category" USING GIN (to_tsvector('english', "name"));