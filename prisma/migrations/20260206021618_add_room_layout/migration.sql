/*
  Warnings:

  - You are about to drop the column `roomSetup` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `roomLayoutId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `roomSetup`,
    ADD COLUMN `roomLayoutId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `RoomLayout` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomLayoutId_fkey` FOREIGN KEY (`roomLayoutId`) REFERENCES `RoomLayout`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
