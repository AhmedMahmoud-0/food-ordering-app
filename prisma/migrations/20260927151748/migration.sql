/*
  Warnings:

  - You are about to drop the column `country` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `OrderProduct` table. All the data in the column will be lost.
  - Added the required column `building` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `OrderProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderProduct" DROP CONSTRAINT "OrderProduct_userId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "country",
DROP COLUMN "postalCode",
ADD COLUMN     "building" TEXT NOT NULL,
ADD COLUMN     "deliveryNotes" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "OrderProduct" DROP COLUMN "userId",
ADD COLUMN     "extras" JSONB,
ADD COLUMN     "size" JSONB,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
