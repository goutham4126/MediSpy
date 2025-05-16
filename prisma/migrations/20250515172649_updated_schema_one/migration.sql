/*
  Warnings:

  - You are about to drop the column `doctorDescription` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `knownTreatment` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "doctorDescription",
DROP COLUMN "knownTreatment",
ADD COLUMN     "doctorAddress" TEXT,
ADD COLUMN     "doctorEducation" TEXT,
ADD COLUMN     "doctorExperience" TEXT,
ADD COLUMN     "doctorGender" TEXT,
ADD COLUMN     "doctorHospital" TEXT,
ADD COLUMN     "doctorLicenseNo" TEXT,
ADD COLUMN     "doctorSpecialization" TEXT;
