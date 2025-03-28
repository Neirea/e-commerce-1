-- AlterTable		
ALTER TABLE "_CategoryToCompany" ADD CONSTRAINT "_CategoryToCompany_AB_pkey" PRIMARY KEY ("A", "B");		

-- DropIndex		
DROP INDEX "_CategoryToCompany_AB_unique";		

-- AlterTable		
ALTER TABLE "_variants" ADD CONSTRAINT "_variants_AB_pkey" PRIMARY KEY ("A", "B");		

-- DropIndex		
DROP INDEX "_variants_AB_unique";		

-- -- AlterTable		
ALTER TABLE "Product"
ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(name, '')), 'A')
) STORED;	

-- Create an index for faster full-text search		
CREATE INDEX product_search_vector_idx ON "Product" USING GIN (search_vector);		

-- AlterTable		
ALTER TABLE "Company"		
ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (		
    setweight(to_tsvector('simple', coalesce(name, '')), 'B')		
) STORED;		

-- Create an index for faster full-text search		
CREATE INDEX company_search_vector_idx ON "Company" USING GIN (search_vector);

-- AlterTable		
ALTER TABLE "Category"		
ADD COLUMN "search_vector" tsvector GENERATED ALWAYS AS (		
    setweight(to_tsvector('simple', coalesce(name, '')), 'C')		
) STORED;		

-- Create an index for faster full-text search		
CREATE INDEX category_search_vector_idx ON "Category" USING GIN (search_vector);	
