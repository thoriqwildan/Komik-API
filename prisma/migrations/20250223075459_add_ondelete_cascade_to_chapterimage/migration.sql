-- DropForeignKey
ALTER TABLE `chapter_images` DROP FOREIGN KEY `chapter_images_chapter_id_fkey`;

-- DropIndex
DROP INDEX `chapter_images_chapter_id_fkey` ON `chapter_images`;

-- AddForeignKey
ALTER TABLE `chapter_images` ADD CONSTRAINT `chapter_images_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
