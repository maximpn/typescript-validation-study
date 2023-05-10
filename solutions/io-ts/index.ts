// must export 'validators'
import { Validators } from '../..';
import { Person, PersonForm, Driver, Vehicle, Fleet } from './types';
import { isRight } from 'fp-ts/Either';
import { pipe } from 'fp-ts/pipeable';
import { Decoder, draw } from 'io-ts/Decoder';

const validator: (decoder: Decoder<any, any>) => (data: any) => any =
  (decoder) => (data: any) =>
    pipe(data, decoder.decode, (result: any) => {
      if (isRight(result)) {
        return result.right;
      }
      throw draw(result.left);
    });

const validators: Validators = {
  person: validator(Person),
  driver: validator(Driver),
  fleet: validator(Fleet),
  vehicle: validator(Vehicle),
  personForm: validator(PersonForm),
};

export default validators;
