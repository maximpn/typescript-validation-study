// must export 'validators'
import { Type } from 'io-ts';
import { Validators } from '../..';
import { formatErrors } from './format_errors';
import * as schemas from './schemas';
import { isRight } from 'fp-ts/Either';

const validator: (decoder: Type<any, any>) => (data: any) => any =
  (decoder) => (data: any) => {
    const result = decoder.decode(data);

    if (isRight(result)) {
      return result.right;
    }

    throw new Error(formatErrors(result.left).join(', '));
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
