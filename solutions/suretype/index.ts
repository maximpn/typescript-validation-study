// must export 'validators'
import type { BaseValidator } from 'suretype';
import { compile } from 'suretype';
import { Validators } from '../..';
import * as schemas from './schemas';

const validator: (schema: BaseValidator<any, any>) => (data: any) => any = (
  schema
) => {
  const validator = compile(schema);

  return (data) => validator(data);
};

const validators: Validators = {
  person: validator(schemas.PersonSchema),
  driver: validator(schemas.DriverSchema),
  fleet: validator(schemas.FleetSchema),
  vehicle: validator(schemas.VehicleSchema),
  personForm: validator(schemas.PersonFormSchema),
  // discriminatedUnion: validator(schemas.DiscriminatedUnionSchema),
};

export default validators;
