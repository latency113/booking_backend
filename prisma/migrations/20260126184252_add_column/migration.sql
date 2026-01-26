/*
  Warnings:

  - Added the required column `participants` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `bookerName` VARCHAR(191) NULL,
    ADD COLUMN `department` VARCHAR(191) NULL,
    ADD COLUMN `participants` INTEGER NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `position` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_department_fkey` FOREIGN KEY (`department`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
