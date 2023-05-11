import * as t from 'io-ts';
import { Either } from 'fp-ts/lib/Either';
import * as D from 'io-ts/Decoder';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts/lib/Either';

export const RestrictedString = <C extends t.StringC>({
  minLength,
  maxLength,
  pattern,
  name = `RestrictedString`,
}: {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  name?: string;
}) => {
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

export const strMinLengthRefine = (n: number) =>
  D.refine(
    (input: string): input is string => input.length >= n,
    `minimum length ${n}`
  );

export const strMaxLengthRefine = (n: number) =>
  D.refine(
    (input: string): input is string => input.length <= n,
    `maximum length ${n}`
  );

export const strPatternRefine = (p: RegExp) =>
  D.refine(
    (input: string): input is string => p.test(input),
    `does not conform to pattern`
  );

export const strDateRefine = D.refine(
  (input: string): input is string => Date.parse(input) !== NaN,
  `input is not date`
);

export const isUndefined = {
  decode: (input: any) =>
    input === undefined
      ? D.success(undefined)
      : D.failure(input, 'not undefined'),
};

export const strDateParser = D.parse<string, Date>((input: string) => {
  const timestamp = Date.parse(input);
  if (timestamp === NaN)
    return D.failure(input, 'input cannot be parsed to date');
  return D.success(new Date(timestamp));
});

export function withDefault<T>(defValue: T) {
  return D.parse<unknown, T>((input: unknown) =>
    input === undefined ? D.success(defValue) : D.success(input as T)
  );
}

export const dateDaysBeforeNowRefine = (numberOfDays: number) =>
  D.refine(
    (input: Date): input is Date =>
      new Date().getTime() - input.getTime() >
      numberOfDays * 24 * 60 * 60 * 1000,
    `not old enough`
  );

export const numIntegerRefine = D.refine(
  (input: number): input is number => Number.isInteger(input),
  'input is not integer'
);
