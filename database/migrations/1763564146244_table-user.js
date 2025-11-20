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
  pgm.createType("user_role", ["user", "admin"]);
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR(100)",
      unique: true,
      notNull: true,
    },
    password: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    nim: {
      type: "VARCHAR(17)",
      unique: true,
      notNull: true,
    },
    role: {
      type: "user_role",
      notNull: true,
      default: "user",
    },
    full_name: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    email: {
      type: "VARCHAR(100)",
      notNull: true,
      unique: true,
    },
    phone: {
      type: "VARCHAR(20)",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("users");
    pgm.dropType("user_role");
};
