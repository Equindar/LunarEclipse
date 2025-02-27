-- lunareclipse.`_rarity` definition

CREATE TABLE `_rarity` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Probability` float NOT NULL,
  `Maximum` float DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `_rarity_unique` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- lunareclipse.traits definition

CREATE TABLE `traits` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `AttributCosts` int(11) DEFAULT 3,
  `CharLevel` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `traits_unique` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- lunareclipse.users definition

CREATE TABLE `users` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Username` varchar(32) NOT NULL,
  `Password` varchar(64) NOT NULL,
  `Salt` varchar(25) NOT NULL,
  `DiscordID` bigint(20) unsigned DEFAULT NULL,
  `Avatar` varchar(100) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL,
  `ChangedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Users_unique` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- lunareclipse.worlds definition

CREATE TABLE `worlds` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `PlayerLimit` int(11) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `worlds_unique` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- lunareclipse.`characters` definition

CREATE TABLE `characters` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(30) NOT NULL,
  `Status` int(11) NOT NULL DEFAULT 0,
  `Avatar` varchar(100) DEFAULT NULL,
  `Experience` int(10) unsigned NOT NULL DEFAULT 0,
  `World_ID` int(10) unsigned NOT NULL,
  `UserID` int(10) unsigned NOT NULL,
  `CreatedDate` datetime NOT NULL,
  `ChangedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `characters_unique` (`Name`),
  CONSTRAINT `characters_users_FK` FOREIGN KEY (`ID`) REFERENCES `users` (`ID`),
  CONSTRAINT `characters_worlds_FK` FOREIGN KEY (`ID`) REFERENCES `worlds` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- lunareclipse.items definition

CREATE TABLE `items` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `ShortDescription` varchar(250) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Value` int(10) unsigned DEFAULT NULL,
  `RarityID` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `items_unique` (`Name`),
  CONSTRAINT `items__rarity_FK` FOREIGN KEY (`ID`) REFERENCES `_rarity` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- lunareclipse.monsters definition

CREATE TABLE `monsters` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Level` int(11) DEFAULT NULL,
  `BaseHealth` int(10) unsigned NOT NULL,
  `PhysicalAttack` int(10) unsigned NOT NULL,
  `PhysicalDefense` int(10) unsigned NOT NULL,
  `MagicalAttack` int(10) unsigned NOT NULL,
  `MagicalDefense` int(10) unsigned NOT NULL,
  `Agility` int(10) unsigned NOT NULL,
  `Status` int(11) NOT NULL DEFAULT 0,
  `Version` int(10) unsigned NOT NULL DEFAULT 1,
  `CreatedDate` datetime NOT NULL,
  `ChangedDate` datetime DEFAULT NULL,
  `RarityID` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `monsters_unique` (`Name`),
  CONSTRAINT `monsters__rarity_FK` FOREIGN KEY (`ID`) REFERENCES `_rarity` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- lunareclipse.character_traits definition

CREATE TABLE `character_traits` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CharacterID` int(10) unsigned NOT NULL,
  `TraitID` int(10) unsigned NOT NULL,
  `Value` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ID`),
  CONSTRAINT `character_traits_characters_FK` FOREIGN KEY (`ID`) REFERENCES `characters` (`ID`),
  CONSTRAINT `character_traits_traits_FK` FOREIGN KEY (`ID`) REFERENCES `traits` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;