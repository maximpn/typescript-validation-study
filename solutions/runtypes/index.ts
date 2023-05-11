/**
 * Found downsides
 * - There is no type coalescing
 * - Impossible to access adjacent fields necessary for form validation (?)
 * - Doesn't change input data. Extra fields don't get filtered out.
 */

// must export 'validators'
import { RuntypeBase } from 'runtypes/lib/runtype';
import { Validators } from '../..';
import * as schemas from './schemas';

const validator: (schema: RuntypeBase) => (data: unknown) => unknown =
  (schema) => (data) => {
    return schema.check(data);
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
