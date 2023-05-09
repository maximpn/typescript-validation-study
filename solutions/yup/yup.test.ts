import { personSchema } from "./schemas";

describe("Person schema", () => {
  it("filters out extra fields", () => {
    const dob = new Date(
      Date.now() - 24 * 60 * 60 * 1000 * 365 * 18 - 100
    ).toISOString();
    const obj = {
      name: "Some name",
      dob,
      sex: "M",
      password: "12345",
      extraField: "something",
    };

    const person = personSchema.cast(obj, { stripUnknown: true });

    expect(person).toEqual({
      name: "Some name",
      dob: new Date(dob),
      sex: "M",
      password: "12345",
    });
  });
});
