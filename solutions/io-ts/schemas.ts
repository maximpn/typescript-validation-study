import * as t from 'io-ts';
import * as utils from './utils';
import { Either } from 'fp-ts/lib/Either';

export const PersonSchema = t.intersection([
  t.type({
    name: utils.RestrictedString({
      minLength: 3,
      maxLength: 20,
      pattern: /[a-z A-Z ]+/,
    }),
    dob: utils.DateString({
      min: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000),
    }),
    password: utils.RestrictedString({ minLength: 5 }),
  }),
  t.partial({
    sex: t.union([t.literal('M'), t.literal('F'), t.literal('O')]),
  }),
]);

export type Person = t.TypeOf<typeof PersonSchema>;

const PersonFormSchemaWithoutValidation = t.intersection([
  PersonSchema,
  t.type({
    repeatPassword: utils.RestrictedString({ minLength: 5 }),
  }),
]);

export type PersonForm = t.TypeOf<typeof PersonFormSchemaWithoutValidation>;

export const PersonFormSchema = PersonFormSchemaWithoutValidation.pipe(
  new t.Type<PersonForm, PersonForm, PersonForm>(
    'PersonFormSchema',
    PersonFormSchemaWithoutValidation.is,
    (input, context): Either<t.Errors, PersonForm> =>
      input.password === input.repeatPassword
        ? t.success(input)
        : t.failure(input, context, 'repeat password does not match'),
    t.identity
  ),
  ''
);

export const DriverSchema = t.intersection([
  PersonSchema,
  t.type({
    licenseNo: utils.RestrictedString({
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z]+$/,
    }),
  }),
]);

export type Driver = t.TypeOf<typeof DriverSchema>;

export const VehicleSchema = t.type({
  type: t.union([t.literal('car'), t.literal('bus')]),
  seats: utils.PositiveInteger,
  length: utils.NonNegativeNumber,
});

export type Vehicle = t.TypeOf<typeof VehicleSchema>;

export const FleetSchema = t.array(
  t.type({
    driver: DriverSchema,
    vehicle: VehicleSchema,
  })
);

export type Fleet = t.TypeOf<typeof FleetSchema>;

export const DiscriminatedUnionSchema = t.union([
  t.intersection([
    t.type({
      foo: utils.NonEmptyString,
    }),
    t.partial({
      bar: t.undefined,
    }),
  ]),
  t.intersection([
    t.partial({
      foo: t.undefined,
    }),
    t.type({
      bar: utils.NonEmptyArray(t.number),
    }),
  ]),
]);

export type DiscriminatedUnion = t.TypeOf<typeof DiscriminatedUnionSchema>;
