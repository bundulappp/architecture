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

  async feed(id: number): Promise<Pet> {
    const pet = await this.repository.feed(id);
    if (!pet) {
      throw new AppError(`The pet has not found with the following id: ${id}`);
    }

    if (pet.food < 0) {
      throw new AppError(`The pet is dead with the following id :${id}`);
    }
    return pet;
  }

  async increaseAge(id: number): Promise<Pet> {
    const pet = await this.repository.increaseAge(id);
    if (!pet) {
      throw new AppError(`The pet has not found with the following id: ${id}`);
    }

    if (pet.food < 0) {
      throw new AppError(`The pet is dead with the following id :${id}`);
    }
    return pet;
  }
}
