-- CreateTable
CREATE TABLE `Bookmark` (
    `username` VARCHAR(191) NOT NULL,
    `series_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`username`, `series_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_series_id_fkey` FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
