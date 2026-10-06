CREATE TABLE `news_test` (
	`ID` int NOT NULL,
	`Title` varchar(500) NOT NULL,
	`Text` varchar(10000) NOT NULL,
	`CreatedAt` timestamp DEFAULT 'current_timestamp()',
	`ModifiedAt` timestamp DEFAULT 'NULL',
	`DeletedAt` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
DROP TABLE `news`;--> statement-breakpoint
DROP TABLE `news2`;--> statement-breakpoint
DROP TABLE `news24`;