/**
 * The old person state
 *
 * @deprecated please use version 2
 */
export class Person_old {
  static $key = 'Person_old' as const;
  static $projection: {
    id?: boolean;
    name?: boolean;
  };
  static $find: {
    id?: number;
  };
  static $unique: {
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
export class Person {
  static $key = 'Person' as const;
  static $projection: {
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
  };
  static $find: {
    id?: number;
  };
  static $unique: {
    id: number;
  };

  /**
   * Person ID
   */
  id!: number;
  firstName!: string;
  lastName?: string | null;
}
