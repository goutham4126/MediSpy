-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "endDate" SET DEFAULT (NOW() + INTERVAL '30 days');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "doctorAvailability" BOOLEAN NOT NULL DEFAULT false;
