CREATE TABLE `accounts` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`pId` varchar(26) NOT NULL,
	`Owner` int,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`DeletedAt` timestamp,
	CONSTRAINT `accounts_uuid` UNIQUE(`pId`),
	CONSTRAINT `accounts_owner_unique` UNIQUE(`Owner`)
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`pId` varchar(26) NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Experience` int NOT NULL DEFAULT 0,
	`User_ID` int NOT NULL,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`DeletedAt` timestamp,
	CONSTRAINT `characters_name_unique` UNIQUE(`Name`),
	CONSTRAINT `characters_uuid` UNIQUE(`pId`)
);
--> statement-breakpoint
CREATE TABLE `characters_inventory` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Item_Version_ID` int NOT NULL,
	`Character_ID` int NOT NULL,
	`Inventory_ID` int NOT NULL,
	`Amount` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `characters_wallet` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Character_ID` int NOT NULL,
	`Amount` int NOT NULL DEFAULT 0,
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	`Updated_At` timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `inventories` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`ID` int NOT NULL,
	`pId` varchar(26) NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Rarity_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext,
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `items_uuid` UNIQUE(`pId`),
	CONSTRAINT `Attributes` CHECK(json_valid(`Attributes`))
);
--> statement-breakpoint
CREATE TABLE `items_blueprint` (
	`ID` int NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Status` enum('Draft','In Review','Active') NOT NULL DEFAULT 'Draft',
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	`Updated_At` timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `items_blueprint_version` (
	`ID` int NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext,
	`Notes` text,
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `Attributes` CHECK(json_valid(`Attributes`))
);
--> statement-breakpoint
CREATE TABLE `items_rarity` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(20),
	CONSTRAINT `Name` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `items_version` (
	`ID` int NOT NULL,
	`Item_ID` int NOT NULL,
	`Blueprint_Version_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext,
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `Attributes` CHECK(json_valid(`Attributes`))
);
--> statement-breakpoint
CREATE TABLE `monsters` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`pId` varchar(26) NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext,
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `monsters_uuid` UNIQUE(`pId`),
	CONSTRAINT `Attributes` CHECK(json_valid(`Attributes`))
);
--> statement-breakpoint
CREATE TABLE `monsters_blueprint` (
	`ID` int NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Status` enum('Draft','In Review','Active') NOT NULL DEFAULT 'Draft',
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	`Updated_At` timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `monsters_blueprint_version` (
	`ID` int NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext,
	`Notes` text,
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `Attributes` CHECK(json_valid(`Attributes`))
);
--> statement-breakpoint
CREATE TABLE `monsters_version` (
	`ID` int NOT NULL,
	`Monster_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Blueprint_Version_ID` int NOT NULL,
	`Attributes` longtext,
	`Created_At` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `Attributes` CHECK(json_valid(`Attributes`))
);
--> statement-breakpoint
CREATE TABLE `news` (
	`ID` int NOT NULL,
	`Title` varchar(500) NOT NULL,
	`Text` varchar(10000) NOT NULL,
	`User_ID` int NOT NULL,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`ModifiedAt` timestamp DEFAULT '0000-00-00 00:00:00',
	`DeletedAt` timestamp DEFAULT '0000-00-00 00:00:00'
);
--> statement-breakpoint
CREATE TABLE `test` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`pId` varchar(26) NOT NULL,
	`Nickname` varchar(100) NOT NULL,
	`Account_id` int NOT NULL,
	`DeletedAt` timestamp,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_nickname_unique` UNIQUE(`Nickname`)
);
--> statement-breakpoint
CREATE TABLE `users_logins` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`User_ID` int NOT NULL,
	`TimeStamp` datetime NOT NULL,
	`Data` varchar(1000)
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_Owner_users_ID_fk` FOREIGN KEY (`Owner`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters` ADD CONSTRAINT `characters_User_ID_users_ID_fk` FOREIGN KEY (`User_ID`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters_inventory` ADD CONSTRAINT `characters_inventory_ID_items_version_ID_fk` FOREIGN KEY (`ID`) REFERENCES `items_version`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters_inventory` ADD CONSTRAINT `characters_inventory_Character_ID_characters_ID_fk` FOREIGN KEY (`Character_ID`) REFERENCES `characters`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters_inventory` ADD CONSTRAINT `characters_inventory_Inventory_ID_inventories_ID_fk` FOREIGN KEY (`Inventory_ID`) REFERENCES `inventories`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters_wallet` ADD CONSTRAINT `characters_wallet_Character_ID_characters_ID_fk` FOREIGN KEY (`Character_ID`) REFERENCES `characters`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_Blueprint_ID_items_blueprint_ID_fk` FOREIGN KEY (`Blueprint_ID`) REFERENCES `items_blueprint`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_Rarity_ID_items_rarity_ID_fk` FOREIGN KEY (`Rarity_ID`) REFERENCES `items_rarity`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `items_blueprint_version` ADD CONSTRAINT `items_blueprint_version_Blueprint_ID_items_blueprint_ID_fk` FOREIGN KEY (`Blueprint_ID`) REFERENCES `items_blueprint`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `items_version` ADD CONSTRAINT `items_version_Item_ID_items_ID_fk` FOREIGN KEY (`Item_ID`) REFERENCES `items`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `items_version` ADD CONSTRAINT `items_version_Blueprint_Version_ID_items_blueprint_version_ID_fk` FOREIGN KEY (`Blueprint_Version_ID`) REFERENCES `items_blueprint_version`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `monsters` ADD CONSTRAINT `monsters_Blueprint_ID_monsters_blueprint_ID_fk` FOREIGN KEY (`Blueprint_ID`) REFERENCES `monsters_blueprint`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `monsters_blueprint_version` ADD CONSTRAINT `monsters_blueprint_version_Blueprint_ID_monsters_blueprint_ID_fk` FOREIGN KEY (`Blueprint_ID`) REFERENCES `monsters_blueprint`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `monsters_version` ADD CONSTRAINT `monsters_version_Monster_ID_monsters_ID_fk` FOREIGN KEY (`Monster_ID`) REFERENCES `monsters`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `monsters_version` ADD CONSTRAINT `monsters_version_Blueprint_Version_ID_monsters_blueprint_version_ID_fk` FOREIGN KEY (`Blueprint_Version_ID`) REFERENCES `monsters_blueprint_version`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `news` ADD CONSTRAINT `news_User_ID_users_ID_fk` FOREIGN KEY (`User_ID`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_Account_id_accounts_ID_fk` FOREIGN KEY (`Account_id`) REFERENCES `accounts`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `users_logins` ADD CONSTRAINT `users_logins_User_ID_users_ID_fk` FOREIGN KEY (`User_ID`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
CREATE INDEX `Item_ID` ON `characters_inventory` (`Item_Version_ID`);--> statement-breakpoint
CREATE INDEX `Character_ID` ON `characters_inventory` (`Character_ID`);--> statement-breakpoint
CREATE INDEX `characters_inventory_Inventory_ID_IDX` ON `characters_inventory` (`Inventory_ID`);--> statement-breakpoint
CREATE INDEX `Character_ID` ON `characters_wallet` (`Character_ID`);--> statement-breakpoint
CREATE INDEX `Blueprint_ID` ON `items` (`Blueprint_ID`);--> statement-breakpoint
CREATE INDEX `Rarity_ID` ON `items` (`Rarity_ID`);--> statement-breakpoint
CREATE INDEX `Blueprint_ID` ON `items_blueprint_version` (`Blueprint_ID`);--> statement-breakpoint
CREATE INDEX `Item_ID` ON `items_version` (`Item_ID`);--> statement-breakpoint
CREATE INDEX `Blueprint_Version_ID` ON `items_version` (`Blueprint_Version_ID`);--> statement-breakpoint
CREATE INDEX `Blueprint_ID` ON `monsters` (`Blueprint_ID`);--> statement-breakpoint
CREATE INDEX `Blueprint_ID` ON `monsters_blueprint_version` (`Blueprint_ID`);--> statement-breakpoint
CREATE INDEX `Monster_ID` ON `monsters_version` (`Monster_ID`);--> statement-breakpoint
CREATE INDEX `Blueprint_Version_ID` ON `monsters_version` (`Blueprint_Version_ID`);