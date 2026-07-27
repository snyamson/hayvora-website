import type { SchemaTypeDefinition } from "sanity";

import * as documents from "./documents";
import * as objects from "./objects";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...Object.values(documents), ...Object.values(objects)],
};
