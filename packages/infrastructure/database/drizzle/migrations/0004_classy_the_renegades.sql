CREATE TABLE `accounts` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`uuid` binary(16) NOT NULL,
	`Owner` int DEFAULT NULL,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	`DeletedAt` timestamp DEFAULT NULL,
	CONSTRAINT `accounts_ID` PRIMARY KEY(`ID`),
	CONSTRAINT `accounts_uuid` UNIQUE(`uuid`),
	CONSTRAINT `accounts_owner_unique` UNIQUE(`Owner`)
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`uuid` binary(16) NOT NULL,
	`name` varchar(100) NOT NULL,
	`experience` int NOT NULL DEFAULT 0,
	`user_ID` int NOT NULL,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	`DeletedAt` timestamp DEFAULT NULL,
	CONSTRAINT `characters_ID` PRIMARY KEY(`ID`),
	CONSTRAINT `characters_name_unique` UNIQUE(`name`),
	CONSTRAINT `characters_uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `characters_inventory` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Item_Version_ID` int NOT NULL,
	`Character_ID` int NOT NULL,
	`Inventory_ID` int NOT NULL,
	`Amount` int NOT NULL DEFAULT 1,
	CONSTRAINT `characters_inventory_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `characters_wallet` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Character_ID` int NOT NULL,
	`Amount` int NOT NULL DEFAULT 0,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `characters_wallet_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `inventories` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	CONSTRAINT `inventories_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`uuid` binary(16) NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Rarity_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext DEFAULT NULL,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `items_ID` PRIMARY KEY(`ID`),
	CONSTRAINT `items_uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `items_blueprint` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Status` enum('Draft','In Review','Active') NOT NULL DEFAULT 'Draft',
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `items_blueprint_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `items_blueprint_version` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext DEFAULT 'NULL',
	`Notes` text DEFAULT ('NULL'),
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `items_blueprint_version_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `items_rarity` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(20) DEFAULT NULL,
	CONSTRAINT `items_rarity_ID` PRIMARY KEY(`ID`),
	CONSTRAINT `Name` UNIQUE(`Name`)
);
--> statement-breakpoint
CREATE TABLE `items_version` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Item_ID` int NOT NULL,
	`Blueprint_Version_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext DEFAULT 'NULL',
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `items_version_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `monsters` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`uuid` binary(16) NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext DEFAULT 'NULL',
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `monsters_ID` PRIMARY KEY(`ID`),
	CONSTRAINT `monsters_uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `monsters_blueprint` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Name` varchar(100) NOT NULL,
	`Status` enum('Draft','In Review','Active') NOT NULL DEFAULT 'Draft',
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monsters_blueprint_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `monsters_blueprint_version` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Blueprint_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Attributes` longtext DEFAULT 'NULL',
	`Notes` text DEFAULT ('NULL'),
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `monsters_blueprint_version_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `monsters_version` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`Monster_ID` int NOT NULL,
	`Version` int NOT NULL,
	`Blueprint_Version_ID` int NOT NULL,
	`Attributes` longtext DEFAULT 'NULL',
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `monsters_version_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`uuid` binary(16) NOT NULL,
	`Title` varchar(500) NOT NULL,
	`Text` varchar(10000) NOT NULL,
	`User_ID` int NOT NULL,
	`CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`UpdatedAt` timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	`DeletedAt` timestamp DEFAULT NULL,
	CONSTRAINT `news_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
DROP TABLE `news_test234`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `DeletedAt` timestamp DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `Account_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_Owner_users_ID_fk` FOREIGN KEY (`Owner`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters` ADD CONSTRAINT `characters_user_ID_users_ID_fk` FOREIGN KEY (`user_ID`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `characters_inventory` ADD CONSTRAINT `characters_inventory_Item_Version_ID_items_version_ID_fk` FOREIGN KEY (`Item_Version_ID`) REFERENCES `items_version`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
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
ALTER TABLE `monsters_version` ADD CONSTRAINT `fk_monsters_version_monsters_BP_version` FOREIGN KEY (`Blueprint_Version_ID`) REFERENCES `monsters_blueprint_version`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `monsters_version` ADD CONSTRAINT `fk_monsters_version_monsters` FOREIGN KEY (`Monster_ID`) REFERENCES `monsters`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `news` ADD CONSTRAINT `news_User_ID_users_ID_fk` FOREIGN KEY (`User_ID`) REFERENCES `users`(`ID`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
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
CREATE INDEX `Blueprint_Version_ID` ON `monsters_version` (`Blueprint_Version_ID`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_Account_id_accounts_ID_fk` FOREIGN KEY (`Account_id`) REFERENCES `accounts`(`ID`) ON DELETE restrict ON UPDATE restrict;