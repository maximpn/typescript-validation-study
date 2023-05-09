import * as rt from "runtypes";

export const personSchema = rt.Record({
  name: rt.String.withConstraint(
    (str) => str.length >= 3 && str.length <= 20 && /^[a-z A-Z ]+$/.test(str)
  ),
  dob: rt.String.withConstraint((value) => {
    if (typeof value !== "string") {
      return false;
    }

    const dob = Date.parse(value);

    return (
      !isNaN(dob) &&
      new Date(dob).getTime() <= Date.now() - 24 * 60 * 60 * 1000 * 365 * 18
    );
  }),
  sex: rt.Union(rt.Literal("M"), rt.Literal("F"), rt.Literal("O")).optional(),
  password: rt.String.withConstraint((str) => str.length >= 5),
});

export const driverSchema = personSchema.extend({
  licenseNo: rt.String.withConstraint(
    (str) => str.length >= 3 && str.length <= 30 && /^[a-zA-Z]+$/.test(str)
  ),
});

export const vehicleSchema = rt.Record({
  type: rt.Union(rt.Literal("car"), rt.Literal("bus")),
  seats: rt.Number.withConstraint((n) => Number.isInteger(n) && n >= 1),
  length: rt.Number.withConstraint((n) => n > 0),
});

export const fleetSchema = rt.Array(
  rt.Record({
    driver: driverSchema,
    vehicle: vehicleSchema,
  })
);

export type Fleet = rt.Static<typeof fleetSchema>;
