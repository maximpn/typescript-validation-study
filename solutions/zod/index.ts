// must export 'validators'
import * as z from 'zod';
import { Validators } from '../..';
import * as schemas from './schemas';

const validator: (schema: z.ZodType<any, any>) => (data: any) => any =
  (schema) => (data) => {
    return schema.parse(data);
  };

const validators: Validators = {
  person: validator(schemas.PersonSchema),
  driver: validator(schemas.DriverSchema),
  fleet: validator(schemas.FleetSchema),
  vehicle: validator(schemas.VehicleSchema),
  personForm: validator(schemas.PersonFormSchema),
  discriminatedUnion: validator(schemas.DiscriminatedUnionSchema),
};

export default validators;
