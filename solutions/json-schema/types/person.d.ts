/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A Person
 */
export type Person = Person1 & {
  dob?: {
    [k: string]: unknown;
  } & string;
  [k: string]: unknown;
};

/**
 * A Person
 */
export interface Person1 {
  name: string;
  dob: {
    [k: string]: unknown;
  } & string;
  sex?: "M" | "F" | "O";
  password: string;
  [k: string]: unknown;
}
