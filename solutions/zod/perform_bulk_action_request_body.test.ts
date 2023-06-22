import {
  BulkActionEditType,
  BulkActionType,
  PerformBulkActionRequestBody,
  saved_object_attributes,
} from './perform_bulk_action_request_body';

describe('saved_object_attributes', () => {
  it('allows recursive values', () => {
    const attributes = {
      foo: 'abc',
      bar: [
        {
          a: [{ x: 'a' }, { y: 10 }, { z: true }],
          b: {
            c: {
              d: {
                e: false,
                f: null,
              },
            },
          },
        },
      ],
    };

    const parsedAttributes = saved_object_attributes.parse(attributes);

    expect(parsedAttributes).toEqual(attributes);
  });
});

describe('PerformBulkActionRequestBody', () => {
  it('accepts query', () => {
    const request: PerformBulkActionRequestBody = {
      query: 'abc',
      action: BulkActionType.enable,
    };

    const parsedRequest = PerformBulkActionRequestBody.parse(request);

    expect(parsedRequest).toEqual(request);
  });

  it('accepts ids', () => {
    const request: PerformBulkActionRequestBody = {
      ids: ['1', '2', '3'],
      action: BulkActionType.disable,
    };

    const parsedRequest = PerformBulkActionRequestBody.parse(request);

    expect(parsedRequest).toEqual(request);
  });

  it('accepts duplicate action', () => {
    const request: PerformBulkActionRequestBody = {
      query: 'abc',
      action: BulkActionType.duplicate,
      [BulkActionType.duplicate]: {
        include_exceptions: true,
        include_expired_exceptions: true,
      },
    };

    const parsedRequest = PerformBulkActionRequestBody.parse(request);

    expect(parsedRequest).toEqual(request);
  });

  it('accepts edit action', () => {
    const request: PerformBulkActionRequestBody = {
      query: 'abc',
      action: BulkActionType.edit,
      [BulkActionType.edit]: [
        {
          type: BulkActionEditType.add_rule_actions,
          value: {
            actions: [
              {
                group: 'some-group',
                id: 'action-1',
                params: {
                  foo: 'abc',
                  bar: [
                    {
                      a: [{ x: 'a' }, { y: 10 }, { z: true }],
                      b: {
                        c: {
                          d: {
                            e: false,
                            f: null,
                          },
                        },
                      },
                    },
                  ],
                },
                frequency: {
                  summary: true,
                  notifyWhen: 'onThrottleInterval',
                  throttle: 'rule',
                },
              },
            ],
            throttle: 'rule',
          },
        },
      ],
    };

    const parsedRequest = PerformBulkActionRequestBody.parse(request);

    expect(parsedRequest).toEqual(request);
  });

  it('ignores an extra field', () => {
    const request = {
      query: 'abc',
      action: BulkActionType.enable,
      unknown_field: 'something',
    };

    const parsedRequest = PerformBulkActionRequestBody.parse(request);

    expect(parsedRequest).toEqual({
      query: 'abc',
      action: BulkActionType.enable,
    });
  });
});
