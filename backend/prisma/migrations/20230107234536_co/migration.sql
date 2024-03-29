-- CreateTable
CREATE TABLE `Pronoun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pronoun` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conjugation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `verbId` INTEGER NOT NULL,
    `pronounId` INTEGER NOT NULL,
    `tenseId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Conjugation` ADD CONSTRAINT `Conjugation_verbId_fkey` FOREIGN KEY (`verbId`) REFERENCES `Verb`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conjugation` ADD CONSTRAINT `Conjugation_pronounId_fkey` FOREIGN KEY (`pronounId`) REFERENCES `Pronoun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conjugation` ADD CONSTRAINT `Conjugation_tenseId_fkey` FOREIGN KEY (`tenseId`) REFERENCES `Tense`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
