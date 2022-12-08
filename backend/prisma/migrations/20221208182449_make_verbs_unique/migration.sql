/*
  Warnings:

  - A unique constraint covering the columns `[verb]` on the table `Verb` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Verb_verb_key` ON `Verb`(`verb`);
