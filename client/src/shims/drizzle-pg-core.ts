// Lightweight chainable stubs so accidental client-side imports of Drizzle
// builders don't crash. These return fluent no-op objects.

type Builder = {
  primaryKey: () => Builder;
  notNull: () => Builder;
  unique: () => Builder;
  defaultNow: () => Builder;
  default: (_v?: any) => Builder;
  references: (_fn?: any) => Builder;
};

const makeBuilder = (): Builder => {
  const self: Builder = {
    primaryKey: () => self,
    notNull: () => self,
    unique: () => self,
    defaultNow: () => self,
    default: () => self,
    references: () => self,
  };
  return self;
};

export const pgTable = (..._args: any[]) => ({}) as any;
export const serial = (..._args: any[]) => makeBuilder() as any;
export const text = (..._args: any[]) => makeBuilder() as any;
export const integer = (..._args: any[]) => makeBuilder() as any;
export const decimal = (..._args: any[]) => makeBuilder() as any;
export const timestamp = (..._args: any[]) => makeBuilder() as any;
export const boolean = (..._args: any[]) => makeBuilder() as any;
export const jsonb = (..._args: any[]) => makeBuilder() as any;
