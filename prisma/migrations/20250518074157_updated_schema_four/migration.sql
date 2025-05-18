/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Subscription` table. All the data in the column will be lost.
  - Changed the type of `plan` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "paymentStatus",
DROP COLUMN "status",
DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan" NOT NULL,
ALTER COLUMN "endDate" SET DEFAULT (NOW() + INTERVAL '30 days');
