/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("responses", {
    id: {
      primaryKey: true,
      type: "VARCHAR(100)",
    },
    request_id: {
        type: "VARCHAR(100)",
        references: "requests(id)",
        onDelete: "CASCADE"
    },
    message: {
        type: "TEXT"
    },
    created_at: {
        type: "timestamp",
        default: pgm.func("current_timestamp"),
        notNull: true
    },
    updated_at: {
        type: "timestamp",
        default: pgm.func("current_timestamp"),
        notNull: true
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("responses")
};
