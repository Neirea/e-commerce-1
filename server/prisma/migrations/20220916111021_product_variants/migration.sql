-- CreateTable
CREATE TABLE "_Variants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Variants_AB_unique" ON "_Variants"("A", "B");

-- CreateIndex
CREATE INDEX "_Variants_B_index" ON "_Variants"("B");

-- AddForeignKey
ALTER TABLE "_Variants" ADD CONSTRAINT "_Variants_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Variants" ADD CONSTRAINT "_Variants_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
