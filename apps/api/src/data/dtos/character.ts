import Character from "@features/characters/core/entities/Character";

export class CharacterDTO {
  uuid: string;
  name: string;
  experience: number;
  owner: string;
  // status: string;

  constructor(character: Character) {
    this.uuid = character.uuid;
    this.name = character.name;
    this.experience = character.experience;
    this.owner = character.owner.name;
  }

  static fromEntity(character: Character): CharacterDTO {
    return new CharacterDTO(character);
  }
}
