CREATE TABLE `items` (
	`ID` int NOT NULL,
	`Name` varchar(100) DEFAULT 'NULL',
	`Value` int DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `monsters` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	CONSTRAINT `monsters_unique` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `test` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`ID` int NOT NULL,
	`Nickname` varchar(100) NOT NULL,
	CONSTRAINT `users_unique` UNIQUE(`Nickname`)
);
--> statement-breakpoint
DROP TABLE `Test`;