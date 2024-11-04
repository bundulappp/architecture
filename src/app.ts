import fastify from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import cors from '@fastify/cors';
import { PathLike } from 'node:fs';
import { JsonFileStore } from './utils/json-file-store';
import { PetService } from './business/pet.service';
import { Pet } from './business/pet-type';
import { postPetSchema } from './schemas/post-pet.schema';
import { paramsIdSchema } from './schemas/get-pet-by-id.schema';
import { AppError } from './utils/app.error';

export default async function createApp(options = {}, dataFilePath: PathLike) {
  const app = fastify(options).withTypeProvider<JsonSchemaToTsProvider>();
  await app.register(cors, {});

  const petStore = new JsonFileStore<Pet>(dataFilePath);
  const petService = new PetService(petStore);

  app.post('/pets', { schema: postPetSchema }, async (request, reply) => {
    const { name } = request.body;

    const newPet = await petService.born(name);

    reply.status(201);
    return newPet;
  });

  app.get('/pets', async () => {
    return await petService.list();
  });

  app.get('/pets/:id', { schema: paramsIdSchema }, async (request, reply) => {
    const { id } = request.params;

    if (isNaN(+id)) {
      return reply.status(400).send({ message: 'Id is not a number' });
    }
    try {
      const pet = await petService.getById(+id);
      return reply.status(200).send(pet);
    } catch (error) {
      if (error instanceof AppError) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  app.post(
    '/pets/:id/food',
    { schema: paramsIdSchema },
    async (request, reply) => {
      const { id } = request.params;

      if (isNaN(+id)) {
        return reply.status(400).send({ message: 'Id is not a number' });
      }

      try {
        const pet = await petService.feed(+id);
        return reply.status(200).send(pet);
      } catch (error) {
        if (error instanceof AppError) {
          reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  app.post(
    '/pets/:id/age',
    { schema: paramsIdSchema },
    async (request, reply) => {
      const { id } = request.params;

      if (isNaN(+id)) {
        return reply.status(400).send({ message: 'Id is not a number' });
      }

      try {
        const pet = await petService.increaseAge(+id);
        return reply.status(200).send(pet);
      } catch (error) {
        if (error instanceof AppError) {
          reply.status(404).send({ message: error.message });
        }
        return reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  );

  return app;
}
