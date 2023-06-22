import * as z from 'zod';

export enum BulkActionType {
  'enable' = 'enable',
  'disable' = 'disable',
  'export' = 'export',
  'delete' = 'delete',
  'duplicate' = 'duplicate',
  'edit' = 'edit',
}

export enum BulkActionEditType {
  'add_tags' = 'add_tags',
  'delete_tags' = 'delete_tags',
  'set_tags' = 'set_tags',
  'add_index_patterns' = 'add_index_patterns',
  'delete_index_patterns' = 'delete_index_patterns',
  'set_index_patterns' = 'set_index_patterns',
  'set_timeline' = 'set_timeline',
  'add_rule_actions' = 'add_rule_actions',
  'set_rule_actions' = 'set_rule_actions',
  'set_schedule' = 'set_schedule',
}

// saved objects attributes
export type SavedObjectAttributeSingle =
  | string
  | number
  | boolean
  | null
  | undefined
  | SavedObjectAttributes;

export type SavedObjectAttribute =
  | SavedObjectAttributeSingle
  | SavedObjectAttributeSingle[];

export interface SavedObjectAttributes {
  [key: string]: SavedObjectAttribute;
}

const saved_object_attribute_single: z.ZodType<SavedObjectAttributeSingle> =
  z.lazy(() =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.null(),
      z.undefined(),
      saved_object_attributes,
    ])
  );
const saved_object_attribute: z.ZodType<SavedObjectAttribute> = z.lazy(() =>
  z.union([
    saved_object_attribute_single,
    z.array(saved_object_attribute_single),
  ])
);
export const saved_object_attributes: z.ZodType<SavedObjectAttributes> = z.lazy(
  () => z.record(z.string(), saved_object_attribute)
);

// Rule misc fields
const RuleQuery = z.string().nonempty();
const RuleTagArray = z.array(z.string());
const IndexPatternArray = z.array(z.string());
const TimelineTemplateId = z.string();
const TimelineTemplateTitle = z.string();
const RuleActionGroup = z.string();
const RuleActionId = z.string();
const RuleActionParams = saved_object_attributes;
const RuleActionSummary = z.boolean();
const RuleActionNotifyWhen = z.union([
  z.literal('onActionGroupChange'),
  z.literal('onActiveAlert'),
  z.literal('onThrottleInterval'),
]);
const RuleActionThrottle = z.union([
  z.literal('no_actions'),
  z.literal('rule'),
  z.string(), // TimeDuration({ allowedUnits: ['s', 'm', 'h', 'd'] }),
]);
const RuleActionFrequency = z.object({
  summary: RuleActionSummary,
  notifyWhen: RuleActionNotifyWhen,
  throttle: z.union([RuleActionThrottle, z.null()]),
});
const RuleActionAlertsFilter = z.string(); // it's an object in fact
const ThrottleForBulkActions = z.union([
  z.literal('rule'),
  z.string(), // TimeDuration({ allowedUnits: [[1, 'h'], [1, 'd'], [7, 'd']] }),
]);

// Perform Bulk Action Body
const PerformBulkActionFilter = z.union([
  z.object({
    query: RuleQuery,
    ids: z.never().optional(),
  }),
  z.object({
    query: z.never().optional(),
    ids: z.array(z.string()).nonempty(),
  }),
]);

const BulkEnableAction = z.object({
  action: z.literal(BulkActionType.enable),
});
const BulkDisableAction = z.object({
  action: z.literal(BulkActionType.disable),
});
const BulkDeleteAction = z.object({
  action: z.literal(BulkActionType.delete),
});
const BulkExportAction = z.object({
  action: z.literal(BulkActionType.export),
});
const BulkDuplicateAction = z.object({
  action: z.literal(BulkActionType.duplicate),
  [BulkActionType.duplicate]: z.object({
    include_exceptions: z.boolean(),
    include_expired_exceptions: z.boolean(),
  }),
});

// Bulk Edit Action
const BulkActionEditPayloadTags = z.object({
  type: z.union([
    z.literal(BulkActionEditType.add_tags),
    z.literal(BulkActionEditType.delete_tags),
    z.literal(BulkActionEditType.set_tags),
  ]),
  value: RuleTagArray,
});

const BulkActionEditPayloadIndexPatterns = z.object({
  type: z.union([
    z.literal(BulkActionEditType.add_index_patterns),
    z.literal(BulkActionEditType.delete_index_patterns),
    z.literal(BulkActionEditType.set_index_patterns),
  ]),
  value: IndexPatternArray,
  overwrite_data_views: z.boolean().optional(),
});

const BulkActionEditPayloadTimeline = z.object({
  type: z.literal(BulkActionEditType.set_timeline),
  value: z.object({
    timeline_id: TimelineTemplateId,
    timeline_title: TimelineTemplateTitle,
  }),
});

const NormalizedRuleAction = z.object({
  group: RuleActionGroup,
  id: RuleActionId,
  params: RuleActionParams,
  frequency: RuleActionFrequency.optional(),
  alerts_filter: RuleActionAlertsFilter.optional(),
});

const BulkActionEditPayloadRuleActions = z.object({
  type: z.union([
    z.literal(BulkActionEditType.add_rule_actions),
    z.literal(BulkActionEditType.set_rule_actions),
  ]),
  value: z.object({
    actions: z.array(NormalizedRuleAction),
    throttle: ThrottleForBulkActions,
  }),
});

const BulkActionEditPayloadSchedule = z.object({
  type: z.literal(BulkActionEditType.set_schedule),
  value: z.object({
    interval: z.string(), // TimeDuration({ allowedUnits: ['s', 'm', 'h'] }),
    lookback: z.string(), // TimeDuration({ allowedUnits: ['s', 'm', 'h'] }),
  }),
});

const BulkActionEditPayload = z.union([
  BulkActionEditPayloadTags,
  BulkActionEditPayloadIndexPatterns,
  BulkActionEditPayloadTimeline,
  BulkActionEditPayloadRuleActions,
  BulkActionEditPayloadSchedule,
]);
const BulkEditAction = z.object({
  action: z.literal(BulkActionType.edit),
  [BulkActionType.edit]: z.array(BulkActionEditPayload).nonempty(),
});

export type PerformBulkActionRequestBody = z.infer<
  typeof PerformBulkActionRequestBody
>;
export const PerformBulkActionRequestBody = z.intersection(
  PerformBulkActionFilter,
  z.union([
    BulkEnableAction,
    BulkDisableAction,
    BulkDeleteAction,
    BulkExportAction,
    BulkDuplicateAction,
    BulkEditAction,
  ])
);
