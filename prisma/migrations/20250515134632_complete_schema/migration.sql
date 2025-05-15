-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PATIENT', 'DOCTOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'ACTIVE', 'PENDING', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "doctorAge" TEXT,
ADD COLUMN     "doctorDescription" TEXT,
ADD COLUMN     "doctorPhone" TEXT,
ADD COLUMN     "knownTreatment" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PATIENT';

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "diagnosis" TEXT,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "patientPhoneNo" TEXT NOT NULL,
    "prescription" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "stage" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
