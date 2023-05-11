// must export 'validators'
import { Validators } from '../..';
import { formatErrors } from './format_errors';
import {
  Person,
  PersonForm,
  Driver,
  Vehicle,
  Fleet,
  DiscriminatedUnionSchema,
} from './types';
import { isRight } from 'fp-ts/Either';

const validator: (decoder: any) => (data: any) => any =
  (decoder) => (data: any) => {
    const result = decoder.decode(data);

    if (isRight(result)) {
      return result.right;
    }

    throw new Error(formatErrors(result.left).join(', '));
  };

const validators: Validators = {
  person: validator(Person),
  driver: validator(Driver),
  fleet: validator(Fleet),
  vehicle: validator(Vehicle),
  personForm: validator(PersonForm),
  discriminatedUnion: validator(DiscriminatedUnionSchema),
};

export default validators;
