import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';

export const RestrictedString = ({
  minLength,
  maxLength,
  pattern,
  name = `RestrictedString`,
}: Partial<{
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  name: string;
}>) => {
  return new t.Type<string, string, unknown>(
    name,
    (input: unknown): input is string => typeof input === 'string',
    (input, context): Either<t.Errors, string> => {
      if (
        typeof input === 'string' &&
        ((minLength && input.length < minLength) ||
          (maxLength && input.length > maxLength))
      ) {
        return t.failure(
          input,
          context,
          `String size (${input.length}) is out of bounds: min: ${
            minLength ?? 'not specified'
          }, max: ${maxLength ?? 'not specified'}`
        );
      }

      if (typeof input === 'string' && pattern && !pattern.test(input)) {
        return t.failure(
          input,
          context,
          `String does not match the pattern ${pattern.toString()})`
        );
      }

      return t.string.validate(input, context);
    },
    t.identity
  );
};

export const DateString = ({ min }: Partial<{ min: Date }>) =>
  new t.Type<string, string, unknown>(
    'DateString',
    t.string.is,
    (input, context): Either<t.Errors, string> => {
      if (typeof input !== 'string') {
        return t.failure(input, context);
      }

      try {
        const parsed = Date.parse(input);

        if (isNaN(parsed)) {
          return t.failure(input, context);
        }

        const parsedDate = new Date(parsed);

        if (min && parsedDate > min) {
          return t.failure(
            input,
            context,
            `Date must be earlier than ${min.toISOString()})`
          );
        }

        return t.success(input);
      } catch (err) {
        return t.failure(input, context);
      }
    },
    t.identity
  );

export const NonEmptyString = new t.Type<string, string, unknown>(
  'NonEmptyString',
  t.string.is,
  (input, context): Either<t.Errors, string> => {
    if (typeof input === 'string' && input.trim() !== '') {
      return t.success(input);
    } else {
      return t.failure(input, context);
    }
  },
  t.identity
);

export const NonNegativeNumber = new t.Type<number, number, unknown>(
  'NonNegativeNumber',
  t.number.is,
  (input, context): Either<t.Errors, number> => {
    return typeof input === 'number' && input >= 0
      ? t.success(input)
      : t.failure(input, context);
  },
  t.identity
);

export const PositiveInteger = new t.Type<number, number, unknown>(
  'PositiveInteger',
  t.number.is,
  (input, context): Either<t.Errors, number> => {
    return typeof input === 'number' && Number.isSafeInteger(input) && input > 0
      ? t.success(input)
      : t.failure(input, context);
  },
  t.identity
);

export const NonEmptyArray = <C extends t.Mixed>(
  codec: C,
  name: string = `NonEmptyArray<${codec.name}>`
) => {
  const arrType = t.array(codec);
  type ArrType = t.TypeOf<typeof arrType>;
  return new t.Type<ArrType, ArrType, unknown>(
    name,
    arrType.is,
    (input, context): Either<t.Errors, ArrType> => {
      if (Array.isArray(input) && input.length === 0) {
        return t.failure(input, context);
      } else {
        return arrType.validate(input, context);
      }
    },
    t.identity
  );
};
