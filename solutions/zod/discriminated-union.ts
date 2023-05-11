import * as z from 'zod';

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

export type DiscriminatedUnion = z.infer<typeof DiscriminatedUnionSchema>;
