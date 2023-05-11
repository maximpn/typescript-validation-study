import * as S from 'superstruct';

export const PersonSchema = S.type({
  name: S.pattern(S.size(S.string(), 3, 20), /^[a-z A-Z ]+$/),
  dob: S.refine(
    S.coerce(S.date(), S.string(), (value) => new Date(value)),
    'dob18years',
    (value) => Date.now() - value.getTime() >= 24 * 60 * 60 * 1000 * 365 * 18
  ),
  sex: S.optional(S.defaulted(S.enums(['M', 'F', 'O'] as const), 'O')),
  password: S.size(S.string(), 5),
});

export type Person = S.Infer<typeof PersonSchema>;

export const PersonFormSchema = S.refine(
  S.assign(
    PersonSchema,
    S.object({
      repeatPassword: S.string(),
    })
  ),
  'perform-form',
  (value) =>
    value &&
    value.password &&
    value.repeatPassword &&
    value.password === value.repeatPassword
      ? true
      : false
);

export const DriverSchema = S.assign(
  PersonSchema,
  S.object({
    licenseNo: S.pattern(S.size(S.string(), 3, 30), /^[a-zA-Z]+$/),
  })
);

export const VehicleSchema = S.object({
  type: S.enums(['car', 'bus']),
  seats: S.min(S.integer(), 1),
  length: S.min(S.number(), 0, { exclusive: true }),
});

export const FleetSchema = S.array(
  S.object({
    driver: DriverSchema,
    vehicle: VehicleSchema,
  })
);

export const DiscriminatedUnionSchema = S.union([
  S.type({
    foo: S.size(S.string(), 1),
    bar: S.optional(S.never()),
  }),
  S.type({
    foo: S.optional(S.never()),
    bar: S.size(S.array(S.number()), 1),
  }),
]);

export type Fleet = S.Infer<typeof FleetSchema>;
export type DiscriminatedUnion = S.Infer<typeof DiscriminatedUnionSchema>;
