export * from './costumers';
export * from './report';
export * from './ask';
export * from './menu-options';
export * from './follow-up-report';
export * from './attention-contact';

export type SearchParams = Record<string, string | number | boolean>;

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
