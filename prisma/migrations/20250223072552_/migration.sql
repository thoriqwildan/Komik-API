/*
  Warnings:

  - You are about to drop the `Chapter_Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Chapter_Image` DROP FOREIGN KEY `Chapter_Image_chapter_id_fkey`;

-- DropTable
DROP TABLE `Chapter_Image`;

-- CreateTable
CREATE TABLE `chapter_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chapter_id` INTEGER NOT NULL,
    `image_url` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chapter_images` ADD CONSTRAINT `chapter_images_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
