/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `authors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `genres` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `artists_name_key` ON `artists`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `authors_name_key` ON `authors`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `genres_name_key` ON `genres`(`name`);
