/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'better-sqlite3' {
  interface Statement<T = any> {
    run(...params: any[]): { changes: number; lastInsertRowid: number };
    get(...params: any[]): T | undefined;
    all(...params: any[]): T[];
    iterate(...params: any[]): IterableIterator<T>;
    prepare(source: string): Statement<T>;
  }

  interface Database {
    exec(source: string): this;
    prepare<T = any>(source: string): Statement<T>;
    close(): this;
    defaultSafeIntegers(): this;
    loadExtension(path: string): this;
    backup(destination: string): Promise<void>;
    serialize(): Buffer;
    transaction<T extends (...args: any[]) => any>(fn: T): T;
    pragma(source: string, options?: { simple?: boolean }): any;
    checkpoint(databaseName?: string): this;
    function(name: string, fn: (...args: any[]) => any): this;
    aggregate(name: string, options: {
      start?: any;
      step: (total: any, next: any) => any;
      inverse?: (total: any, dropped: any) => any;
      result?: (total: any) => any;
    }): this;
    readonly open: boolean;
    readonly inTransaction: boolean;
    readonly name: string;
    readonly memory: boolean;
    readonly readonly: boolean;
  }

  interface DatabaseConstructor {
    new (filename: string, options?: {
      readonly?: boolean;
      fileMustExist?: boolean;
      timeout?: number;
      verbose?: (...args: any[]) => void;
    }): Database;
    (filename: string, options?: {
      readonly?: boolean;
      fileMustExist?: boolean;
      timeout?: number;
      verbose?: (...args: any[]) => void;
    }): Database;
  }

  const Database: DatabaseConstructor;
  export = Database;
}
