import { FastifyInstance } from 'fastify';
import createApp from '../src/app';
import { join } from 'node:path';
import { PathLike, unlinkSync } from 'node:fs';

let app: FastifyInstance | undefined;
let testDataFile: PathLike | undefined;

beforeEach(async () => {
  const testDataFileName = `test-data-${Date.now()}.json`;
  testDataFile = join(__dirname, 'test-data', testDataFileName);
  app = await createApp({ logger: false }, testDataFile);
});

describe('POST /pets', () => {
  it('should create a pet', async () => {
    const name = 'Fluffy';
    const expectedPet = {
      id: 1,
      name: 'Fluffy',
      age: 1,
      weight: 1,
      food: 1,
    };

    const response = await app!.inject().body({ name }).post('/pets');
    const body = JSON.parse(response.body);

    expect(response.statusCode).toStrictEqual(201);
    expect(body).toStrictEqual(expectedPet);
  });
});

describe('GET /pets', () => {
  it('should get the pets', async () => {
    const createPetBody = { name: 'Fluffy' };
    const expectedPets = [
      { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 1 },
    ];

    await app!.inject().body(createPetBody).post('/pets');
    const response = await app!.inject().get('/pets');
    const body = JSON.parse(response.body);

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPets);
  });
});

describe('GET /pets/:id', () => {
  it('should get a pet', async () => {
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 1 };

    await app!.inject().body(createPetBody).post('/pets');

    const response = await app!.inject().get('/pets/1');
    const body = JSON.parse(response.body);

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  });

  it('should return 404 if pet is not found', async () => {
    const response = await app!.inject().get('/pets/999');
    expect(response.statusCode).toStrictEqual(404);
    expect(JSON.parse(response.body).message).toBe(
      'The pet has not found with the following id: 999'
    );
  });

  it('should return 400 for invalid ID format', async () => {
    const response = await app!.inject().get('/pets/invalid-id');

    expect(response.statusCode).toStrictEqual(400);
  });
});

describe('POST /:id/food', () => {
  it('should increase the target pet food property by one and return it', async () => {
    //Arrange
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 2 };

    //Act
    await app!.inject().body(createPetBody).post('/pets');
    const response = await app!.inject().post('pets/1/food');
    const body = JSON.parse(response.body);
    //Assert
    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  });

  it('should return 404 if pet is not found', async () => {
    const response = await app!.inject().post('/pets/999/food');
    expect(response.statusCode).toStrictEqual(404);
    expect(JSON.parse(response.body).message).toBe(
      'The pet has not found with the following id: 999'
    );
  });
  // it('should return 404 if pet is already dead', async () => {
  //   //Act
  //   const response = await app!.inject().post('pets/1/food');
  //   const body = JSON.parse(response.body);
  //   //Assert
  //   expect(response.statusCode).toStrictEqual(404);
  //   expect(JSON.parse(response.body).message).toBe(
  //     'The pet is dead with the following id: 1'
  //   );
  // });
});

describe('POST /:id/age', () => {
  it('should increase the target pet food property by one and return it', async () => {
    //Arrange
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = { id: 1, name: 'Fluffy', age: 2, weight: 1, food: 1 };

    //Act
    await app!.inject().body(createPetBody).post('/pets');
    const response = await app!.inject().post('pets/1/age');
    const body = JSON.parse(response.body);
    //Assert
    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  });

  it('should return 404 if pet is not found', async () => {
    const response = await app!.inject().post('/pets/999/age');
    expect(response.statusCode).toStrictEqual(404);
    expect(JSON.parse(response.body).message).toBe(
      'The pet has not found with the following id: 999'
    );
  });
});

afterEach(() => {
  app?.close();
  unlinkSync(testDataFile!);
});
