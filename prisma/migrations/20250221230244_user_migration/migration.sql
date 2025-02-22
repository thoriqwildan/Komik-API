-- CreateTable
CREATE TABLE `User` (
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NULL,
    `role` ENUM('user', 'admin', 'editor') NOT NULL DEFAULT 'user',
    `imgUrl` VARCHAR(191) NULL DEFAULT '/profiles/index.png',
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
