// must export 'validators'
import * as yup from 'yup';
import { Validators } from '../..';
import * as schemas from './schemas';

const validator: (schema: yup.Schema) => (data: any) => any =
  (schema) => (data) => {
    return schema.validateSync(data, {
      abortEarly: false,
    });
  };

const validators: Validators = {
  person: validator(schemas.personSchema),
  driver: validator(schemas.driverSchema),
  fleet: validator(schemas.fleetSchema),
  vehicle: validator(schemas.vehicleSchema),
  personForm: validator(schemas.personFormSchema),
};

export default validators;

export type PersonInput = yup.Asserts<typeof schemas.personSchema>;
export type PersonCasted = yup.InferType<typeof schemas.personSchema>; // note properties can be undefined

export type PersonFormInput = yup.Asserts<typeof schemas.personFormSchema>;
export type PersonFormCasted = yup.InferType<typeof schemas.personFormSchema>; // note properties can be undefined

export type DriverInput = yup.Asserts<typeof schemas.driverSchema>;
export type DriverCasted = yup.InferType<typeof schemas.driverSchema>; // note properties can be undefined

export type FleetInput = yup.Asserts<typeof schemas.fleetSchema>;
export type FleetCasted = yup.InferType<typeof schemas.fleetSchema>; // note properties can be undefined
