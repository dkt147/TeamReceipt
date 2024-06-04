/*
  Warnings:

  - You are about to drop the column `body` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `post` table. All the data in the column will be lost.
  - Added the required column `caption` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `body`,
    DROP COLUMN `title`,
    ADD COLUMN `caption` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;
