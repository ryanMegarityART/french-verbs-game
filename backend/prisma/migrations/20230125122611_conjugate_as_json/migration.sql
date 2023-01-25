/*
  Warnings:

  - You are about to drop the column `pronounId` on the `Conjugation` table. All the data in the column will be lost.
  - You are about to drop the `Pronoun` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conjugations` to the `Conjugation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Conjugation` DROP FOREIGN KEY `Conjugation_pronounId_fkey`;

-- AlterTable
ALTER TABLE `Conjugation` DROP COLUMN `pronounId`,
    ADD COLUMN `conjugations` JSON NOT NULL;

-- DropTable
DROP TABLE `Pronoun`;
