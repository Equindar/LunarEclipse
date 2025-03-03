-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `characters` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(30) NOT NULL,
	`Status` int(11) NOT NULL DEFAULT 0,
	`Avatar` varchar(100) DEFAULT 'NULL',
	`Experience` int(10) unsigned NOT NULL DEFAULT 0,
	`World_ID` int(10) unsigned NOT NULL,
	`UserID` int(10) unsigned NOT NULL,
	`CreatedDate` datetime NOT NULL,
	`ChangedDate` datetime DEFAULT 'NULL',
	CONSTRAINT `characters_unique` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `character_traits` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`CharacterID` int(10) unsigned NOT NULL,
	`TraitID` int(10) unsigned NOT NULL,
	`Value` int(11) NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `items` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	`ShortDescription` varchar(250) DEFAULT 'NULL',
	`Description` text DEFAULT 'NULL',
	`Value` int(10) unsigned DEFAULT 0,
	`RarityID` int(11) NOT NULL DEFAULT 0,
	CONSTRAINT `items_unique` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `monsters` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Description` text DEFAULT 'NULL',
	`Level` int(11) DEFAULT 0,
	`BaseHealth` int(10) unsigned NOT NULL,
	`PhysicalAttack` int(10) unsigned NOT NULL,
	`PhysicalDefense` int(10) unsigned NOT NULL,
	`MagicalAttack` int(10) unsigned NOT NULL,
	`MagicalDefense` int(10) unsigned NOT NULL,
	`Agility` int(10) unsigned NOT NULL,
	`Status` int(11) NOT NULL DEFAULT 0,
	`Version` int(10) unsigned NOT NULL DEFAULT 1,
	`CreatedDate` datetime NOT NULL,
	`ChangedDate` datetime DEFAULT 'NULL',
	`RarityID` int(10) unsigned NOT NULL,
	CONSTRAINT `monsters_unique` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `traits` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Description` text DEFAULT 'NULL',
	`AttributCosts` int(11) DEFAULT 3,
	`CharLevel` int(11) NOT NULL DEFAULT 1,
	CONSTRAINT `traits_unique` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`Username` varchar(32) NOT NULL,
	`Password` varchar(64) NOT NULL,
	`Salt` varchar(25) NOT NULL,
	`DiscordID` bigint(20) unsigned DEFAULT 0,
	`Avatar` varchar(100) DEFAULT 'NULL',
	`CreatedDate` datetime NOT NULL,
	`ChangedDate` datetime DEFAULT 'NULL',
	CONSTRAINT `Users_unique` UNIQUE(`Username`)
);
--> statement-breakpoint
CREATE TABLE `worlds` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	`PlayerLimit` int(11) DEFAULT 0,
	`Description` longtext DEFAULT 'NULL',
	`StartDate` datetime DEFAULT 'NULL',
	`EndDate` datetime DEFAULT 'NULL',
	CONSTRAINT `worlds_unique` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `_rarity` (
	`ID` int(10) unsigned AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Probability` float NOT NULL,
	`Maximum` float DEFAULT 'NULL',
	CONSTRAINT `_rarity_unique` UNIQUE(`Name`)
);
--> statement-breakpoint
ALTER TABLE `characters` ADD CONSTRAINT `characters_users_FK` FOREIGN KEY (`ID`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters` ADD CONSTRAINT `characters_worlds_FK` FOREIGN KEY (`ID`) REFERENCES `worlds`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `character_traits` ADD CONSTRAINT `character_traits_characters_FK` FOREIGN KEY (`ID`) REFERENCES `characters`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `character_traits` ADD CONSTRAINT `character_traits_traits_FK` FOREIGN KEY (`ID`) REFERENCES `traits`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items__rarity_FK` FOREIGN KEY (`ID`) REFERENCES `_rarity`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `monsters` ADD CONSTRAINT `monsters__rarity_FK` FOREIGN KEY (`ID`) REFERENCES `_rarity`(`ID`) ON DELETE restrict ON UPDATE restrict;
*/