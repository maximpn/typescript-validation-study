// must export 'validators'
import * as S from 'superstruct';
import * as schemas from './schemas';
import { Validators } from '../..';

const validator: (schema: S.Struct<any, any>) => (data: any) => any =
  (schema) => (data) => {
    try {
      return S.create(data, schema);
    } catch (err) {
      const allFailures = [];
      for (const f of (err as S.StructError).failures()) {
        allFailures.push(f);
      }
      throw allFailures;
    }
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
