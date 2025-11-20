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
  pgm.createTable("requests", {
    id: {
      type: "VARCHAR(100)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(100)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    type: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    queue: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    message: {
      type: "TEXT",
    },
    created_at: {
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
  pgm.dropTable("requests");
};
