-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `news` (
	`ID` int(11) NOT NULL,
	`Title` varchar(500) NOT NULL,
	`Text` varchar(10000) NOT NULL,
	`CreatedAt` timestamp DEFAULT 'current_timestamp()',
	`ModifiedAt` timestamp DEFAULT 'NULL',
	`DeletedAt` timestamp DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `news2` (
	`ID` int(11) NOT NULL,
	`Title` varchar(500) NOT NULL,
	`Text` varchar(10000) NOT NULL,
	`CreatedAt` timestamp DEFAULT 'current_timestamp()',
	`ModifiedAt` timestamp DEFAULT '''0000-00-00 00:00:00''',
	`DeletedAt` timestamp DEFAULT '''0000-00-00 00:00:00'''
);
--> statement-breakpoint
CREATE TABLE `news24` (
	`ID` int(11) NOT NULL,
	`Title` varchar(500) NOT NULL,
	`Text` varchar(10000) NOT NULL,
	`CreatedAt` timestamp DEFAULT 'current_timestamp()',
	`ModifiedAt` timestamp DEFAULT '''0000-00-00 00:00:00''',
	`DeletedAt` timestamp DEFAULT '''0000-00-00 00:00:00'''
);

*/