import { personSchema } from "./schemas";

describe("Person schema", () => {
  it("does not filter out extra fields", () => {
    const dob = new Date(
      Date.now() - 24 * 60 * 60 * 1000 * 365 * 18
    ).toISOString();
    const obj = {
      name: "Some name",
      dob,
      sex: "M",
      password: "12345",
      extraField: "something",
    };

    const person = personSchema.check(obj);

    expect(person).toEqual({
      name: "Some name",
      dob,
      sex: "M",
      password: "12345",
      extraField: "something",
    });
  });
});
