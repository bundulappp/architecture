import { PetRepository } from '../data-access/pet.repository';
import { AppError } from '../utils/app.error';
import { JsonFileStore } from '../utils/json-file-store';
import { Pet } from './pet-type';

export class PetService {
  private readonly repository;
  constructor(store: JsonFileStore<Pet>) {
    this.repository = new PetRepository(store);
  }

  async born(name: string): Promise<Pet> {
    const created = await this.repository.create({
      name,
      food: 1,
      weight: 1,
      age: 1,
    });
    return created;
  }

  async list(): Promise<Pet[]> {
    return await this.repository.list();
  }

  async getById(id: number): Promise<Pet> {
    const matchingPet = await this.repository.getById(id);

    if (!matchingPet) {
      throw new AppError(`The pet has not found with the following id: ${id}`);
    }

    return matchingPet;
  }
}
