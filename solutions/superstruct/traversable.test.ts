import { FleetSchema, DriverSchema } from './schemas';

describe('Superstruct schema traversable test', () => {
  it('is able to determine that type of fleet is an array, and driver is an object', () => {
    expect(FleetSchema.type).toBe('array');
    expect(DriverSchema.type).toBe('type');
  });
  it('is able to find the item type of fleet schema (object)', () => {
    expect(FleetSchema.schema.type).toBe('object');
  });
  it('is further able to find all keys in the item object of fleet schema', () => {
    const shapeObj = FleetSchema.schema.schema;
    expect(Object.keys(shapeObj).length).toBe(2);
    expect(Object.keys(shapeObj)).toContain('driver');
    expect(Object.keys(shapeObj)).toContain('vehicle');
  });
});
