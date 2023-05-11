import Joi from 'joi';

export const DiscriminatedUnionSchema = Joi.alternatives(
  Joi.object({
    foo: Joi.string().required().min(1),
    bar: Joi.optional(),
  }),
  Joi.object({
    foo: Joi.optional(),
    bar: Joi.array().required().items(Joi.number()).min(1),
  })
);
