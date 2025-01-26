import type { Severity } from "./error-types";

export type CatalogEntry = Record<string, unknown> & {
  message: string;
  severity?: Severity;
};

export type Catalog = Record<string, CatalogEntry>;
