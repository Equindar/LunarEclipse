export interface ICharacterInteractor {
    createCharacter(input: any);
    getCharacter(id: number);
    listCharacters();
    updateCharacter(input: any);
}