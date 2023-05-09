/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Driver
 */
export type Driver = Person & {
  licenseNo: string;
  [k: string]: unknown;
};
/**
 * Fleet
 */
export type Fleet = {
  driver: Driver;
  vehicle: Vehicle;
  [k: string]: unknown;
}[];

/**
 * A Person
 */
export interface Person {
  name: string;
  dob: (
    | {
        [k: string]: unknown;
      }
    | {
        [k: string]: unknown;
      }
  ) &
    string;
  sex?: "M" | "F" | "O";
  password: string;
  [k: string]: unknown;
}
/**
 * Vehicle
 */
export interface Vehicle {
  type: "car" | "bus";
  seats: number;
  length: number;
  [k: string]: unknown;
}
