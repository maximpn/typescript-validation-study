import { FleetSchema, DriverSchema } from './schemas';

describe('Zod schema traversable test', () => {
  it('is able to determine that type of fleet is an array, and driver is an object', () => {
    expect(FleetSchema._def.typeName).toBe('ZodArray');
    expect(DriverSchema._def.typeName).toBe('ZodObject');
  });
  it('is able to find the item type of fleet schema (object)', () => {
    expect(FleetSchema._def.type._def.typeName).toBe('ZodObject');
  });
  it('is further able to find all keys in the item object of fleet schema', () => {
    const shapeObj = FleetSchema._def.type.shape;
    expect(Object.keys(shapeObj).length).toBe(2);
    expect(Object.keys(shapeObj)).toContain('driver');
    expect(Object.keys(shapeObj)).toContain('vehicle');
  });
});
