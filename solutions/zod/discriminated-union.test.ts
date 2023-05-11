import { DiscriminatedUnionSchema } from './discriminated-union';

describe('Zod discriminated union', () => {
  it('validates the first option successfully', () => {
    const containingFoo = DiscriminatedUnionSchema.parse({
      foo: 'some string',
    });

    expect(containingFoo).toEqual({
      foo: 'some string',
    });
  });

  it('validates the second option successfully', () => {
    const containingBar = DiscriminatedUnionSchema.parse({
      bar: [1, 2],
    });

    expect(containingBar).toEqual({
      bar: [1, 2],
    });
  });

  it('ignores an unknown field', () => {
    const containingFoo = DiscriminatedUnionSchema.parse({
      foo: 'some string',
      unknownField: 'something',
    });

    expect(containingFoo).toEqual({
      foo: 'some string',
    });
  });

  // There is no strict on union type
  it('fails with strict schema if an unknown field is presented', () => {
    expect(() =>
      DiscriminatedUnionSchema.parse({
        foo: 'some string',
        unknownField: 'something',
      })
    ).toThrow();
  });

  it('fails if an array is empty', () => {
    expect(() =>
      DiscriminatedUnionSchema.parse({
        bar: [],
      })
    ).toThrow();
  });

  it('fails if two options are present simultaneously', () => {
    expect(() =>
      DiscriminatedUnionSchema.parse({
        foo: 'some string',
        bar: [1, 2],
      })
    ).toThrow();
  });
});
