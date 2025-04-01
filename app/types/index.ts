export * from './costumers';
export * from './report';
export * from './ask';
export * from './menu-options';
export * from './follow-up-report';

export type QueryResult<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

export type ValueDetails = {
  id: string;
  name: string;
};

export type GenericRecord = Record<string, unknown>;
