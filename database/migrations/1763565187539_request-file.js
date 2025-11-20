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
    pgm.createTable("url_req", {
        id: {
            type: "VARCHAR(100)",
            primaryKey: true
        },
        url: {
            type: "TEXT",
            notNull: true
        },
        req_id: {
            type: "VARCHAR(100)",
            references: "requests(id)",
            notNull: true
        },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("url_req")
};
