import { Validators } from '../..';
import { Type } from './kbn-config-schema';
import * as schemas from './schemas';

const validator: (schema: Type<unknown>) => (data: any) => any =
  (schema) => (data) => {
    return schema.validate(data);
  };

const validators: Validators = {
  person: validator(schemas.PersonSchema),
  driver: validator(schemas.DriverSchema),
  fleet: validator(schemas.FleetSchema),
  vehicle: validator(schemas.VehicleSchema),
  personForm: validator(schemas.PersonFormSchema),
};

export default validators;
