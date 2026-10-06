CREATE TABLE `news_test234` (
	`ID` int NOT NULL,
	`Title` varchar(500) NOT NULL,
	`Text` varchar(10000) NOT NULL,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`ModifiedAt` timestamp DEFAULT '0000-00-00 00:00:00',
	`DeletedAt` timestamp DEFAULT '0000-00-00 00:00:00'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`uuID` binary(16) NOT NULL,
	`Email` varchar(254) NOT NULL,
	`Email_verified` tinyint NOT NULL DEFAULT 0,
	`DisplayName` varchar(255) DEFAULT 'NULL',
	`isActive` tinyint NOT NULL DEFAULT 1,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`ModifiedAt` timestamp DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
	`DeletedAt` timestamp DEFAULT '0000-00-00 00:00:00',
	CONSTRAINT `users_ID` PRIMARY KEY(`ID`),
	CONSTRAINT `uq_users_email` UNIQUE(`Email`),
	CONSTRAINT `uq_users_uuid` UNIQUE(`uuID`)
);
--> statement-breakpoint
DROP TABLE `news_test`;