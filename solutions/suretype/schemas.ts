import { v, TypeOf } from 'suretype';

export const PersonSchema = v.object({
  name: v
    .string()
    .minLength(3)
    .maxLength(20)
    .matches(/^[a-z A-Z ]+$/)
    .required(),
  dob: v
    .anyOf([v.string().format('date'), v.string().format('date-time')])
    .required(),
  sex: v.string().enum('M', 'F', 'O').default('O'),
  password: v.string().minLength(5).required(),
});

export type Person = TypeOf<typeof PersonSchema>;

export const PersonFormSchema = PersonSchema.additional(
  v.object({
    repeatPassword: v.string().minLength(5).required(),
  })
);

export type PersonForm = TypeOf<typeof PersonFormSchema>;

export const DriverSchema = PersonSchema.additional(
  v.object({
    licenseNo: v
      .string()
      .minLength(3)
      .maxLength(30)
      .matches(/^[a-zA-Z]+$/)
      .required(),
  })
);

export type Driver = TypeOf<typeof DriverSchema>;

export const VehicleSchema = v.object({
  type: v.string().enum('car', 'bus').required(),
  seats: v.number().integer().gte(1).required(),
  length: v.number().gte(0).required(),
});

export type Vehicle = TypeOf<typeof VehicleSchema>;

export const FleetSchema = v.array(
  v.object({
    driver: DriverSchema,
    vehicle: VehicleSchema,
  })
);

export type Fleet = TypeOf<typeof FleetSchema>;
