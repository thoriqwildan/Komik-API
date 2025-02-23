-- DropForeignKey
ALTER TABLE `Bookmark` DROP FOREIGN KEY `Bookmark_series_id_fkey`;

-- DropForeignKey
ALTER TABLE `chapters` DROP FOREIGN KEY `chapters_series_id_fkey`;

-- DropIndex
DROP INDEX `Bookmark_series_id_fkey` ON `Bookmark`;

-- DropIndex
DROP INDEX `chapters_series_id_fkey` ON `chapters`;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_series_id_fkey` FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_series_id_fkey` FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
