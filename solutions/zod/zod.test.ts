import { PersonSchema, SomeIntersectionSchema } from './schemas';

describe('Person schema', () => {
  it('filters out extra fields', () => {
    const dob = new Date(
      Date.now() - 24 * 60 * 60 * 1000 * 365 * 18
    ).toISOString();
    const obj = {
      name: 'Some name',
      dob,
      sex: 'M',
      password: '12345',
      extraField: 'something',
    };

    const person = PersonSchema.parse(obj);

    expect(person).toEqual({
      name: 'Some name',
      dob: new Date(dob),
      sex: 'M',
      password: '12345',
    });
  });
});

describe('strict intersection', () => {
  it('works', () => {
    const obj = {
      a: 'abc',
      b: 10,
      c: true,
      d: 20,
    };

    const parsedObj = SomeIntersectionSchema.parse(obj);

    expect(parsedObj).toEqual({
      a: 'abc',
      b: 10,
      c: true,
      d: 20,
    });
  });
});
