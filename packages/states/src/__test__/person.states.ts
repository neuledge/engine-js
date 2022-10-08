/**
 * The old person state
 *
 * @deprecated please use version 2
 */
export class Person_v1 {
  static $key = 'Person-1' as const;
  static $projection: {
    id?: boolean;
    name?: boolean;
  };
  static $query: {
    id?: number;
  };
  static $uniqueQuery: {
    id: number;
  };

  /**
   * Person ID
   */
  id!: number;
  /**
   * @deprecated not safe format
   */
  name!: string;
}

/**
 * The latest Person state!
 * Got it??
 */
export class Person_v2 {
  static $key = 'Person-2' as const;
  static $projection: {
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
  };
  static $query: {
    id?: number;
  };
  static $uniqueQuery: {
    id: number;
  };

  /**
   * Person ID
   */
  id!: number;
  firstName!: string;
  lastName?: string | null;
}
