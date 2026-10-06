ALTER TABLE `news_test234` RENAME COLUMN `ModifiedAt` TO `UpdatedAt`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `uuID` TO `uuid`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `ModifiedAt` TO `UpdatedAt`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `uq_users_uuid`;--> statement-breakpoint
ALTER TABLE `news_test234` MODIFY COLUMN `ID` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `news_test234` MODIFY COLUMN `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `news_test234` MODIFY COLUMN `UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `news_test234` MODIFY COLUMN `DeletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `Email_verified` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `DisplayName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `isActive` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `DeletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `news_test234` ADD PRIMARY KEY(`ID`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `uq_users_displayname` UNIQUE(`DisplayName`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `uq_users_uuid` UNIQUE(`uuid`);