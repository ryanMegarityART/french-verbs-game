/*
  Warnings:

  - Added the required column `tense` to the `Tense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tense` ADD COLUMN `tense` VARCHAR(191) NOT NULL;
