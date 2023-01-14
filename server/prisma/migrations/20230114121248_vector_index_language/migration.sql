-- Drop Indexes
DROP INDEX "Product_name_idx";

DROP INDEX "Company_name_idx";

DROP INDEX "Category_name_idx";

-- Create Search Indexes
CREATE INDEX "Product_name_idx" ON "Product" USING GIN (to_tsvector('simple', "name"));

CREATE INDEX "Company_name_idx" ON "Company" USING GIN (to_tsvector('simple', "name"));

CREATE INDEX "Category_name_idx" ON "Category" USING GIN (to_tsvector('simple', "name"));