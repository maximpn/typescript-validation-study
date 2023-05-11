import { TypeOf, schema } from './kbn-config-schema';

export const PersonSchema = schema.object(
  {
    name: schema.string({
      minLength: 3,
      maxLength: 20,
      validate: (value) =>
        !/^[a-z A-Z ]+$/.test(value)
          ? 'must contain only letters or spaces'
          : undefined,
    }),
    dob: schema.string({
      validate: (value) => {
        const timestamp = Date.parse(value);

        if (isNaN(timestamp)) {
          return 'must be a date';
        }

        return Date.now() - timestamp < 24 * 60 * 60 * 1000 * 365 * 18
          ? 'must be older'
          : undefined;
      },
    }),
    sex: schema.maybe(
      schema.oneOf([
        schema.literal('M'),
        schema.literal('F'),
        schema.literal('O'),
      ])
    ),
    password: schema.string({ minLength: 5 }),
  },
  {
    unknowns: 'ignore',
  }
);

export const PersonFormSchema = PersonSchema.extends(
  {
    repeatPassword: schema.string(),
  },
  {
    validate: (value) =>
      value.password !== value.repeatPassword
        ? 'repeatPassword must match the password'
        : undefined,
  }
);

export const DriverSchema = PersonSchema.extends({
  licenseNo: schema.string({
    minLength: 3,
    maxLength: 30,
    validate: (value) =>
      !/^[a-zA-Z]+$/.test(value) ? 'must be a valid license number' : undefined,
  }),
});

export const VehicleSchema = schema.object({
  type: schema.oneOf([schema.literal('car'), schema.literal('bus')]),
  seats: schema.number({
    min: 1,
    validate: (value) =>
      !Number.isInteger(value) ? 'must be an integer' : undefined,
  }),
  length: schema.number({
    validate: (value) => (value <= 0 ? 'must be positive' : undefined),
  }),
});

export const FleetSchema = schema.arrayOf(
  schema.object({
    driver: DriverSchema,
    vehicle: VehicleSchema,
  })
);

export const DiscriminatedUnionSchema = schema.oneOf([
  schema.object({
    foo: schema.string({ minLength: 1 }),
    bar: schema.maybe(schema.never()),
  }),
  schema.object({
    foo: schema.maybe(schema.never()),
    bar: schema.arrayOf(schema.number(), { minSize: 1 }),
  }),
]);

export type DiscriminatedUnion = TypeOf<typeof DiscriminatedUnionSchema>;
