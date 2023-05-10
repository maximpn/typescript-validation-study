/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export type FleetSchema = {
  driver?: {
    /**
     * Unknown Property
     */
    [x: string]: unknown;
    dob: Date;
    licenseNo: string;
    name: string;
    password: string;
    sex?: 'M' | 'F' | 'O';
  };
  vehicle?: {
    length: number;
    seats: number;
    type: 'car' | 'bus';
  };
}[];
