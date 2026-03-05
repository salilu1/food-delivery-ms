-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `txRef` VARCHAR(191) NOT NULL,
    `chapaReference` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'ETB',
    `status` ENUM('INITIALIZED', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'INITIALIZED',
    `provider` VARCHAR(191) NOT NULL DEFAULT 'CHAPA',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_txRef_key`(`txRef`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
