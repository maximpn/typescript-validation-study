import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';

export const PersonSchema = t.intersection([
  t.type({
    name: t.refinement(
      t.string,
      (s) => s.length >= 3 && s.length <= 20 && /[a-z A-Z ]+/.test(s)
    ),
    dob: t.refinement(
      DateFromISOString,
      (date) => date < new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
    ),
    password: t.refinement(t.string, (s) => s.length >= 5),
  }),
  t.partial({
    sex: t.union([t.literal('M'), t.literal('F'), t.literal('O')]),
  }),
]);

export const PersonFormSchema = t.refinement(
  t.intersection([
    PersonSchema,
    t.type({
      repeatPassword: t.refinement(t.string, (s) => s.length >= 5),
    }),
  ]),
  (form) => form.password === form.repeatPassword,
  'repeat password and password must match'
);

export type PersonForm = t.TypeOf<typeof PersonFormSchema>;

export const DriverSchema = t.intersection([
  PersonSchema,
  t.type({
    licenseNo: t.refinement(
      t.string,
      (s) => s.length >= 3 && s.length <= 30 && /^[a-zA-Z]+$/.test(s)
    ),
  }),
]);

export type Driver = t.TypeOf<typeof DriverSchema>;

export const VehicleSchema = t.type({
  type: t.union([t.literal('car'), t.literal('bus')]),
  seats: t.refinement(t.number, (n) => Number.isSafeInteger(n) && n > 0),
  length: t.refinement(t.number, (n) => n > 0),
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
      foo: t.refinement(t.string, (s) => s.length > 0),
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
      bar: t.refinement(t.array(t.number), (arr) => arr.length > 0),
    }),
  ]),
]);

export type DiscriminatedUnion = t.TypeOf<typeof DiscriminatedUnionSchema>;
