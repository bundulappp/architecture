import { Pet, PetProperties } from '../business/pet-type';
import { JsonFileStore } from '../utils/json-file-store';

function getNextId<T extends { id: number }>(items: T[]) {
  if (items.length === 0) {
    return 1;
  }
  const ids = items.map((item) => item.id);
  const maxId = Math.max(...ids);
  return maxId + 1;
}

export class PetRepository {
  constructor(private readonly store: JsonFileStore<Pet>) {}

  async create(petProperties: PetProperties): Promise<Pet> {
    const pets = await this.store.read();
    const nextId = getNextId(pets);

    const newPet = {
      ...petProperties,
      id: nextId,
    };

    pets.push(newPet);
    await this.store.write(pets);
    return newPet;
  }

  async list(): Promise<Pet[]> {
    const pets = await this.store.read();
    return pets;
  }

  async getById(id: number): Promise<Pet | undefined> {
    const pets = await this.store.read();
    return pets.find((p) => p.id === id);
  }

  async feed(id: number): Promise<Pet | undefined> {
    const pets = await this.store.read();

    const matchingPet = pets.find((pet) => pet.id === id);

    if (matchingPet) {
      matchingPet.food++;
      return matchingPet;
    }
    return;
  }

  async increaseAge(id: number): Promise<Pet | undefined> {
    const pets = await this.store.read();

    const matchingPet = pets.find((pet) => pet.id === id);

    if (matchingPet) {
      matchingPet.age++;
      return matchingPet;
    }
    return;
  }
}
