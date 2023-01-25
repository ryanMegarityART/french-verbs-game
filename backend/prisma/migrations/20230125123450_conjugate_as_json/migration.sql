/*
  Warnings:

  - A unique constraint covering the columns `[verbId,tenseId]` on the table `Conjugation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Conjugation_verbId_tenseId_key` ON `Conjugation`(`verbId`, `tenseId`);
