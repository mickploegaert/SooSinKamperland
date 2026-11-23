import "server-only";
import { type LocalSchema, mutateDb, nextId, readDb } from "./store";

type TableName = keyof LocalSchema;
type RowOf<K extends TableName> = LocalSchema[K][number];

/**
 * Algemene CRUD-hulp voor één tabel in de lokale opslag. Repositories
 * gebruiken dit zodat iedere tabel zich hetzelfde gedraagt.
 */
export function localTable<K extends TableName>(name: K) {
  type Row = RowOf<K>;
  const rows = (db: LocalSchema) => db[name] as Row[];

  return {
    async all(): Promise<Row[]> {
      return [...rows(await readDb())];
    },

    async find(id: number): Promise<Row | null> {
      return rows(await readDb()).find((row) => row.id === id) ?? null;
    },

    insert(data: Omit<Row, "id">): Promise<Row> {
      return mutateDb((db) => {
        const row = { ...data, id: nextId(rows(db)) } as Row;
        rows(db).push(row);
        return row;
      });
    },

    update(id: number, patch: Partial<Omit<Row, "id">>): Promise<Row | null> {
      return mutateDb((db) => {
        const index = rows(db).findIndex((row) => row.id === id);
        if (index === -1) return null;
        const row = { ...rows(db)[index], ...patch, id } as Row;
        rows(db)[index] = row;
        return row;
      });
    },

    remove(id: number): Promise<boolean> {
      return mutateDb((db) => {
        const index = rows(db).findIndex((row) => row.id === id);
        if (index === -1) return false;
        rows(db).splice(index, 1);
        return true;
      });
    },
  };
}
