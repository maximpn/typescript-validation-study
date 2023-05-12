# typescript-validation-study-2023

Study of various typescript data validation solutions (as of 2023). This repo is forked from [bingtimren](https://github.com/bingtimren/typescript-validation-study)'s research made a couple of years ago.

## Why?

- Something could've changed since the last research
- Some new libraries have appeared or gained popularity and it worths to add them to comparison
- Good to see if libraries can handle harder use cases like a discriminated union
- Good to see performance comparison

## Evaluation Goals

I wish to find a solution that satisfy the following goals:

- DRY - don't repeat yourself, data schema / type shall be defined only once and then enable both static (compile time) and runtime checking. Since the requirement of runtime validation is more specific than the typing system (e.g. maximum length of string, string pattern, etc.), it's often the validation schema is converted to the typescript types (losing some fine-grained constraints).
- Extensible (Composable & Extensible) - if data types are related, e.g. composition (one data type is the part of another), inheritance (one data type is the base of another), the solution shall allow such relationship so as not to repeat the codes
- Fine-grained - enables validations similar to https://json-schema.org/draft/2019-09/json-schema-validation.html
- Form-friendly - if the validation is friendly to UI forms, i.e. validate multiple fields, and give meaningful information
- Fail-fast - for backend validation, fail at first violation
- Combinable - allows multiple validators on same node (AND), or even better, allows a logic expression
- Customizable - allows custom validators
- Type Coercion - converting value from one type to another, e.g. string to Date
- Default - able to provide default value, kind of coercion from undefined -> default value
- Traversable - runtime schema can be traversed at runtime
- Standard - if the schema / type defining language is a standard and supported by a community

## Example Problem and Test Criteria

The test case consists of

- `Person`
- `PersonForm` extends `Person` and focuses on front end validation
- `Driver` extends `Person`
- `Vehicle`
- `Fleet` consists of `Driver`s and `Vehicle`s
- `DiscriminatedUnion` as some complex data structure

These types defined below as TypeScript types with comments. In the best case the same types would be inferred by the libraries under consideration.

```ts
type Person = {
  /**
   * required, length 3~20, pattern /[a-z A-Z ]+/
   * (tests Find-grained, Form-friendly (reports actual length)
   * Combinable / Customizable
   */
  name: string;
  /**
   * required, < now-18
   * (tests Fine-grained, Combinable / Customizable)
   */
  dob: Date; // or string if it's impossible to convert to Date
  /**
   * optional
   */
  sex?: 'M' | 'F' | 'O';
  /**
   * not null, length >= 5
   */
  password: string;
};

/**
 * Extends Person
 */
type PersonForm = Person & {
  /**
   * same as password (Customizable, Form-friendly)
   */
  repeatPassword: string;
};

/**
 * Extends Person
 */
type Driver = Person & {
  /**
   * length 3~30, pattern /^[a-zA-Z]+$/
   */
  licenseNo: string;
};

type Vehicle = {
  /**
   * length 3~30, pattern /^[a-zA-Z]+$/
   */
  type: 'car' | 'bus';
  /**
   * integer, >=1
   */
  seats: number;
  /**
   * > 0
   */
  length: number;
};

type Fleet = Array<{
  driver: Driver;
  vehicle: Vehicle;
}>;

type DiscriminatedUnion =
  | {
      foo: string; // non empty string
      bar?: never;
    }
  | {
      foo?: never;
      bar: [number, ...number[]]; // Non empty number array
    };
```

## Candidate Criteria

The candidates must not be experimental, at least not stated as experimental in README.

Validation is done against plain Javascript objects, not requiring data to be class objects.

## Test Method

I implement validators using each of the tested solutions to validate the above entities. Find them in [/solutions](/solutions).

Each module in the "solutions" dir exports a set of validators. I use them to validate the same set of [data](/validation-data.ts). Each solution needs to pass all the tests. To run the tests, execute `npm t`. While running the tests, the schemas are also compiled into typescript types, and you can find those in each solution's respective folders. Check the "pre" run script in [package.json](package.json).

To examine if the validation result contains all the information for UI form, I used a "fleet" instance as example. Every items and fields of that instance have validation errors. The returned object should describe the problems in full. Run `npm run inspect` to examine the returned error object by each solution in checking that "fleet" instance.

## Results

### io-ts

Reference: https://medium.com/swlh/typescript-runtime-validation-with-io-ts-456f095b7f86

| Goal          | Achieved | Comment                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DRY           | Yes      | Define run-time type, extract corresponding static type                                                                                                                                                                                                                                                                                                                |
| Composable    | Yes      | Defined run-time types can be used as building blocks for other types                                                                                                                                                                                                                                                                                                  |
| Extensible    | Yes      | Use 'pipe' to add properties                                                                                                                                                                                                                                                                                                                                           |
| Fine-grained  | Yes/no   | Not out-of-box, but can write custom decoders                                                                                                                                                                                                                                                                                                                          |
| Combinable    | Yes      | Uses 'pipe' to combine multiple validators                                                                                                                                                                                                                                                                                                                             |
| Form-friendly | Yes-but  | Look at the returned object, all errors about all nodes of the data are there. However the useful information is buried in a myriad of wrappers and difficult to use. There is a default error reporter that is able to retrieve the information and organize in a meaningful way, meaning utilization of the information is possible, but more work needs to be done. |
| Fail-fast     | No       | The decoder does not stop at first error                                                                                                                                                                                                                                                                                                                               |
| Customizable  | Yes      | Can write custom decoders, refines, etc.                                                                                                                                                                                                                                                                                                                               |
| T-coercion    | Yes      | Strong typed parser can parse one type to another                                                                                                                                                                                                                                                                                                                      |
| Default       | Yes      | Though need some complex tweaks                                                                                                                                                                                                                                                                                                                                        |
| Traversable   | No       | The realtime type is a decoder, with a decode function                                                                                                                                                                                                                                                                                                                 |
| Standard      | No       | Realtime type defined with io-ts                                                                                                                                                                                                                                                                                                                                       |

Comment:

To use io-ts also means to use at least some basic fp-ts and functional programming.

Generally when schema is a bit complex, type inference does not work that well. Also because io-ts kind of insisting functional programming purity, somethings it's difficult to figure out how to make things work as I'm not very familiar with functional programming.

### Joi

Can it work on both back-end and front-end? One user [said](https://www.reddit.com/r/reactjs/comments/awluya/reusable_validation_at_serverside_and_frontend/) "I used shared joi schema on backend, web frontend and react-native app. In the end I ditched it, because it's super heavy and requires joi-browser and some extra hacking to work on client side."

| Goal          | Achieved | Comment                                                                                       |
| ------------- | -------- | --------------------------------------------------------------------------------------------- |
| DRY           | Yes\*    | With joi-to-typescript, Joi schema can be used to generate typescript types (code generation) |
| Composable    | Yes      |                                                                                               |
| Extensible    | Yes      |                                                                                               |
| Fine-grained  | Yes      |                                                                                               |
| Combinable    | Yes      |                                                                                               |
| Form-friendly | Yes      | There is an "abortEarly" option                                                               |
| Fail-fast     | Yes      |                                                                                               |
| Customizable  | Yes      |                                                                                               |
| T-coercion    | Yes      | By default. Can be controlled with `.options({convert:false})` or `.raw()`                    |
| Default       | Yes      |                                                                                               |
| Traversable   | Yes      |                                                                                               |
| Standard      | Kind-of  | Joi is hugely popular                                                                         |

Comment:

Joi is hugely popular so there's an ecosystem around it.
Some says it's heavy and not front-end friendly. The same post suggests yup.
There are joi browser and joi vue integration packages out there, not sure how it works.
There is also 'joi-extract-typescript' package to extract typescript without additional build step.

Type generation is actually much better than inference. The generated schema is straight-forward (not relying on union etc.) and enum works like a charm.

### YUP

YUP is inspired by Joi. In fact working with YUP is very much like working with JOI. Both very easy to work with, especially with code assist when defining schemas. TS types can be converted from schema out-of-box, without adding another tool or build step.

| Goal          | Achieved                   | Comment                                                                                    |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| DRY           | Yes                        | out-of-box support                                                                         |
| Composable    | Yes                        |                                                                                            |
| Extensible    | Yes                        |                                                                                            |
| Fine-grained  | Yes                        |                                                                                            |
| Combinable    | Yes                        |                                                                                            |
| Form-friendly | Yes                        |                                                                                            |
| Fail-fast     | Yes                        |                                                                                            |
| Customizable  | Yes                        |                                                                                            |
| T-coercion    | Yes                        | By default yes. Option 'strict' skip coercion or transformation. See document for details. |
| Default       | Yes                        |                                                                                            |
| Traversable   | Yes                        |                                                                                            |
| Standard      | No, but reasonably popular |                                                                                            |

Comment:

YUP self-claim to be the leaner and more front-end friendly alternative of JOI, and probably there's a truth behind it. In terms of [popularity](https://www.npmtrends.com/ajv-vs-joi-vs-yup) JOI is a bit more popular than YUP. Yet I found some developer comments their switch from JOI to YUP.

About type inference:

- enum works, but needs to define an enum to make it work. `sex: yup.mixed<Sex>().oneOf(Object.values(Sex)).default(Sex.OTHER),`
- another option without forcing an enum is like [this](./solutions/yup/schemas.ts), however do read the comments in the code. 'optional' and enum does not mix well.
- inference generally works ok, but when type becomes complex (see Fleet) yup types begin to mix in.

### json-schema based

JSON schema is a standard and has the support of an ecosystem - tools, libraries, tutorials, etc.

There are converters to convert JSON schema to typescript types and converters to do the reverse. Since JSON schema is more expressive in specifying validation rules, and is a standard with good documentations out there on Internet, I feel it's better to write schema in JSON schema then convert to TS types.

On the other way, to write schema in TS types then convert to schema, requires specifying validation rules in typescript types, with non-standard annotations in comments. I attempted to do this, and found the documentation is insufficient, and also difficult because lack of tool support (code assist). For example in the [API document](https://github.com/YousefED/typescript-json-schema/blob/master/api.md) of typescript-json-schema package I cannot find how to specify the minimum length requirement of a string.

For this reason I prefer writing schema in JSON schema and convert to typescript types.

In my test I used:

- ajv : used as JSON Schema validator
- json-schema-to-typescript : produce typescript types (Note: be careful of a bug that overwrite source file https://github.com/bcherny/json-schema-to-typescript/issues/365)

| Goal          | Achieved | Comment                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DRY           | Yes      | The conversion works well                                                                                                                                                                                                                                                                                                                                                                  |
| Composable    | Yes      | With "$ref" JSON schema can be composed. See [https://json-schema.org/understanding-json-schema/structuring.html]                                                                                                                                                                                                                                                                          |
| Extensible    | Yes      | Although not in an typical OO way such as "extends", but to use "allOf", it works                                                                                                                                                                                                                                                                                                          |
| Fine-grained  | Yes      | Has a rich keywords for defining fine-grained constraints                                                                                                                                                                                                                                                                                                                                  |
| Combinable    | Yes      | Multiple keywords can be added to single data point, and "allOf" can also be used                                                                                                                                                                                                                                                                                                          |
| Form-friendly | Yes      | Through an option "allErrors: true"                                                                                                                                                                                                                                                                                                                                                        |
| Fail-fast     | Yes      | Option "allErrors: false"                                                                                                                                                                                                                                                                                                                                                                  |
| Customizable  | Yes      | See [user defined keywords](https://ajv.js.org/docs/keywords.html) for details. Keywords can be defined with code generation, validation function, compilation function, and macro function. However the document is a bit vague and code generation is difficult to debug, maybe only suitable for simple implementations. See an example in [index.ts](/solutions/json-schema/index.ts). |
| T-coercion    | Yes\*    | See [ajv document](https://ajv.js.org/docs/validation.html#coercing-data-types) and comment below                                                                                                                                                                                                                                                                                          |
| Default       | Yes      | With option "useDefault".                                                                                                                                                                                                                                                                                                                                                                  |
| Traversable   | Yes      | JSON schema is a JSON itself                                                                                                                                                                                                                                                                                                                                                               |
| Standard      | Yes      |                                                                                                                                                                                                                                                                                                                                                                                            |

Comment:

This solution ticks all the boxes. Plus ajv claim to be the fastest among all JSON schema validators and works well in both backend and frontend.

Type generation - looks ok, but when schema references each other the generated type definitions do not. Resulting multiple definitions of the same schema appear multiple times.

In addition ajv can use JSON schema to generate standalone validation code that claimed "can be used without ajv". This feature is also tested, and the result is good. However, "standalone" / "used without ajv" may not be true in most cases. In the generated code, dependency of ajv is still found, as mentioned in the document "Ajv package should still be a run-time dependency for most schemas, but generated modules can only depend on small parts of it", therefore saving bundle size (tree shaking?).

My experience working with this solution is:

Yes it's powerful, once you figure out how to do things. Also there are a lot of tools out there help you write your schema. However when something went wrong with the schema, sometimes the error message returned from ajv is vague and does not give the location of the error, leaves me scratching my head.

Type coercion has some default out-of-the-box behaviors that's handy. However default coercion lacks string -> Date (Date is not a basic type). Then to write a custom keyword it very difficult. I finally achieved it though. See [code](solutions/json-schema/customer-keywords.ts) for implementation.

Document for custom keyword is terrible, incomplete and out of dated (February 2021). When trying to work out how to create a custom keyword that also modifies data (type coercion) it's even more difficult. At last I realized the string -> Date type coercion in "person" however it's not with code generation, therefore stand-alone validator cannot use.

To define custom validation keywords with code generation is not intuitive and if things go wrong, it can be difficult to debug (due to the nature of code generation). Nevertheless other methods are provided.
See:

- [User defined keywords](https://github.com/ajv-validator/ajv/blob/master/docs/keywords.md#define-keyword-with-code-generation-function)
- [KeywordCxt](https://github.com/ajv-validator/ajv/blob/master/lib/compile/context.ts) and
- [SchemaCxt](https://github.com/ajv-validator/ajv/blob/master/lib/compile/index.ts)
- Examples:
  - keyword ["type"](https://github.com/ajv-validator/ajv/blob/master/lib/vocabularies/jtd/type.ts)

My overall experience is json-schema (ajv) is not as easy to use as joi. That's said, ajv claim to work well on both front and back end, while there are complaints about joi on frontend (not verified myself). Both ajv and joi should be powerful enough to satisfy most validation needs.

### Zod

Zod is a new comer to the game, and apparently assimilated a lot of ideas from existing validators. The design ideas can be found [here](https://colinhacks.com/essays/zod).

| Goal          | Achieved | Comment                                                                                                                           |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| DRY           | Y        | Extracting typescript types is one design aim of zod. It works pretty well.                                                       |
| Composable    | Yes      |                                                                                                                                   |
| Extensible    |          | Yes                                                                                                                               |
| Fine-grained  | Yes      |                                                                                                                                   |
| Combinable    | Yes      |                                                                                                                                   |
| Form-friendly | Yes      |                                                                                                                                   |
| Fail-fast     | Maybe    | ".check" method may do the fast checking, but not explicitly mentioned in document                                                |
| Customizable  | Yes      |                                                                                                                                   |
| T-coercion    | Not-yet  | It's been discussed. See [issue 264](https://github.com/colinhacks/zod/issues/264). Also library "myzod" is mentioned to do this. |
| Default       | Not-yet  |                                                                                                                                   |
| Traversable   | Yes      |                                                                                                                                   |
| Standard      | No       |                                                                                                                                   |

Comment:

Zod has a lot of design ideas that I agree with. Also the developer experience with zod is good (as good as, and similar to joi & yup). It's very small, zero dependencies, work in browsers and node.js.

Type inference also works somehow better than Yup. Enum inference works out-of-the-box. Inferred type Fleet is more readable.

Only regret that Zod does not support type coercion and default value - yet. I'm still watching it with a lot of interest.

### Superstruct

| Goal          | Achieved | Comment                                                              |
| ------------- | -------- | -------------------------------------------------------------------- |
| DRY           | Yes      | However enum not correctly inferred                                  |
| Composable    | Yes      |                                                                      |
| Extensible    | Yes      |                                                                      |
| Fine-grained  | Yes      | However not providing as rich features as other libraries out-of-box |
| Combinable    | Yes      |                                                                      |
| Form-friendly | Yes      |                                                                      |
| Fail-fast     | Yes      |                                                                      |
| Customizable  | Yes      |                                                                      |
| T-coercion    | Yes      | See [this](https://docs.superstructjs.org/guides/03-coercing-data)   |
| Default       | Yes      | Use "defaulted"                                                      |
| Traversable   | Yes      |                                                                      |
| Standard      | No       |                                                                      |

Comment:

Superstruct is yet another validator defining schema with code. However the development experience is not as good as joi, yup and zod. It does not use a fluent API (method chaining) but a nested one, resulting clumsy nested parenthesis.

However the size of superstruct is very small, if not the smallest among the candidates. Type inference works the best among the type inference solutions. About enum, for type inference to work, it should be passed an array literal like this: `S.optional(S.defaulted(S.enums(["M", "F", "O"] as const), "O"))`

## Honorary Mention

### Package v8n

It looks like yet another validator similar to joi / yup. However looks like it's still under work to properly support typescript.

### Package validate-typescript

Yet another validator, last published 2 years ago, not very popular, and no static type extraction support in the box.

### validate.js

It doesn't seem to have Typescript support

### validator.js

String only but feature rich validator. May use to build custom format or refinement.

## Conclusion

For Json schema based, ajv is a good choice. Also it's much more popular then the other options. However JSON schema is more verbose than, and a bit more difficult to work with (still ok) than schema defined with codes.

JOI, YUP, Superstruct and Zod all define schema with codes, has good typescript support (code assist).

JOI, YUP and Zod all use a fluent API that's more easy to work with than superstruct. JOI may not be very front-end friendly, and does not come with type inference out-of-box (but there exists tool to convert schemas to TS types). Zod lacks type coercion and default value features at this moment, although it's catching up. YUP's type inference is not as good as superstruct. Superstruct is very small in size, has the best type inference among them all, but the API is a bit more difficult to work with (not that difficult, just a lot embedded parentheses).

Zod is the youngest and cannot compete with the other options for popularity but is very promising. It has a small size and no dependency.

Superstruct, although lacks fluent API, still performs very well and should be seriously considered.

IO-TS is very functional programming inclined. In fact it's nearly impossible to work with IO-TS without working with FP-TS and to understand some concepts of functional programming.

See comparison of these packages [here](https://www.npmtrends.com/ajv-vs-joi-vs-yup-vs-zod-vs-io-ts-vs-superstruct).

## Maybe one day......

The following candidates are in my radar. I did not try them at this moment, but maybe one day I will.

- class-validator + class-transformer: this is a class based solution. However class-transformer can transform plain Javascript objects into class instances.
- [myzod](https://github.com/davidmdm/myzod): inspired by zod and claim to be much faster. Still not very popular. See how it goes.

## Reference and credits

Reference: https://learning-notes.mistermicheels.com/javascript/typescript/runtime-type-checking/

---

### template (for next candidate)

| Goal          | Achieved | Comment |
| ------------- | -------- | ------- |
| DRY           |          |         |
| Composable    |          |         |
| Extensible    |          |         |
| Fine-grained  |          |         |
| Combinable    |          |         |
| Form-friendly |          |         |
| Fail-fast     |          |         |
| Customizable  |          |         |
| Traversable   |          |         |
| Standard      |          |         |

Comment:
