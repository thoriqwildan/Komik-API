/*
  Warnings:

  - Added the required column `dirUrl` to the `chapters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chapters` ADD COLUMN `dirUrl` VARCHAR(100) NOT NULL;
