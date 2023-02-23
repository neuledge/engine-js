import { StorePrimaryKey } from '@neuledge/store';
import { escapeFieldName, unescapeFieldName } from './fields';

/* eslint-disable max-lines-per-function */

describe('fields', () => {
  describe('escapeFieldName', () => {
    const primaryKey: StorePrimaryKey = {
      fields: { id: {} },
    } as never;
    const primaryKeys: StorePrimaryKey = {
      fields: { id: {}, sub_id: {} },
    } as never;

    it('should handle primary key', () => {
      expect(escapeFieldName(primaryKey, 'id')).toBe('_id');
    });

    it('should handle primary keys', () => {
      expect(escapeFieldName(primaryKeys, 'id')).toBe('_id.id');
      expect(escapeFieldName(primaryKeys, 'sub_id')).toBe('_id.sub_id');
    });

    it('should keep name', () => {
      expect(escapeFieldName(primaryKey, 'name')).toBe('name');
      expect(escapeFieldName(primaryKeys, 'name')).toBe('name');
    });

    it('should escape _id', () => {
      expect(escapeFieldName(primaryKey, '_id')).toBe('_id_org');
    });

    it('should escape v', () => {
      expect(escapeFieldName(primaryKey, 'v')).toBe('v');
    });

    it('should escape _org', () => {
      expect(escapeFieldName(primaryKey, '_org')).toBe('_org_org');
    });

    it('should escape foo_org', () => {
      expect(escapeFieldName(primaryKey, 'foo_org')).toBe('foo_org_org');
    });

    it('should escape _org_org', () => {
      expect(escapeFieldName(primaryKey, '_org_org')).toBe('_org_org_org');
    });
  });

  describe('unescapeFieldName', () => {
    it('should keep id', () => {
      expect(unescapeFieldName('id')).toBe('id');
    });

    it('should keep name', () => {
      expect(unescapeFieldName('name')).toBe('name');
    });

    it('should keep _id', () => {
      expect(unescapeFieldName('_id')).toBe('_id');
    });

    it('should keep v', () => {
      expect(unescapeFieldName('v')).toBe('v');
    });

    it('should unescape _id_org', () => {
      expect(unescapeFieldName('_id_org')).toBe('_id');
    });

    it('should unescape v_org', () => {
      expect(unescapeFieldName('v_org')).toBe('v');
    });

    it('should unescape foo_org', () => {
      expect(unescapeFieldName('foo_org')).toBe('foo');
    });

    it('should unescape _org_org', () => {
      expect(unescapeFieldName('_org_org')).toBe('_org');
    });

    it('should unescape _org_org_org', () => {
      expect(unescapeFieldName('_org_org_org')).toBe('_org_org');
    });
  });
});
