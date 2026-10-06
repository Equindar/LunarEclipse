import { customType, int } from "drizzle-orm/mysql-core";
import { generateUuidBuffer } from "../../../src/utils/uuid.js";

const binaryUuid = customType<{
  data: Buffer;
  driverData: Buffer;
  config: { length: number };
}>({
  dataType(config) {
    return `binary(${config?.length ?? 16})`;
  },
});

export const idColumn = () => ({
  id: int("ID").autoincrement().notNull().primaryKey(),
});

export const uuidColumn = () => ({
  uuid: binaryUuid("uuid", { length: 16 })
    .notNull()
    .$defaultFn(() => generateUuidBuffer()),
});

export const idColumns = () => ({
  ...idColumn(),
  ...uuidColumn(),
});
