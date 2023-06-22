import * as z from 'zod';

export const PersonSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z A-Z ]+$/),
  dob: z
    .string()
    .refine(
      (strDate) =>
        new Date(strDate).getTime() <=
        Date.now() - 24 * 60 * 60 * 1000 * 365 * 18
    )
    .transform((val) => new Date(val)),
  sex: z.enum(['M', 'F', 'O']).optional(),
  password: z.string().min(5),
});

export const PersonFormSchema = PersonSchema.extend({
  repeatPassword: z.string(),
}).refine((value) =>
  value &&
  value.password &&
  value.repeatPassword &&
  value.password === value.repeatPassword
    ? true
    : false
);

export const DriverSchema = PersonSchema.extend({
  licenseNo: z
    .string()
    .max(30)
    .min(3)
    .regex(/^[a-zA-Z]+$/),
});

export const VehicleSchema = z.object({
  type: z.enum(['car', 'bus']),
  seats: z.number().int().min(1),
  length: z.number().positive(),
});

export const FleetSchema = z.array(
  z.object({
    driver: DriverSchema,
    vehicle: VehicleSchema,
  })
);

export const DiscriminatedUnionSchema = z.union([
  z.object({
    foo: z.string().nonempty(),
    bar: z.never().optional(),
  }),
  z.object({
    foo: z.never().optional(),
    bar: z.array(z.number()).nonempty(),
  }),
]);

export type Fleet = z.infer<typeof FleetSchema>;
export type DiscriminatedUnion = z.infer<typeof DiscriminatedUnionSchema>;

export type SomeIntersection = z.infer<typeof SomeIntersectionSchema>;
export const SomeIntersectionSchema = z.intersection(
  z
    .object({
      a: z.string(),
      b: z.number(),
    })
    .strict(),
  z
    .object({
      c: z.boolean(),
      d: z.number(),
    })
    .strict()
);
