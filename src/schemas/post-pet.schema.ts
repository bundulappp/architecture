export const postPetSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  },
} as const;
