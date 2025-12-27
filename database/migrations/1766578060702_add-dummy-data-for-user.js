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
  pgm.sql(`
        INSERT INTO users (
        id,
        username,
        password,
        nim,
        role,
        full_name,
        email,
        phone,
        url_photo
        ) VALUES
        (
        'user-001',
        'admin1',
        '$2b$10$Xm2Ewg8cdgLEPjNeoe8qcux1oufl5O7M4aGVXEiaeE1K0KHLaPbWu',
        '202400000001',
        'admin',
        'Admin Utama',
        'admin1@example.com',
        '081234567801',
        NULL
        ),
        (
        'user-002',
        'admin2',
        '$2b$10$Xm2Ewg8cdgLEPjNeoe8qcux1oufl5O7M4aGVXEiaeE1K0KHLaPbWu',
        '202400000002',
        'admin',
        'Admin Kedua',
        'admin2@example.com',
        '081234567802',
        NULL
        ),
        (
        'user-003',
        'user1',
        '$2b$10$Xm2Ewg8cdgLEPjNeoe8qcux1oufl5O7M4aGVXEiaeE1K0KHLaPbWu',
        '202400000003',
        'user',
        'User Pertama',
        'user1@example.com',
        '081234567803',
        NULL
        ),
        (
        'user-004',
        'user2',
        '$2b$10$Xm2Ewg8cdgLEPjNeoe8qcux1oufl5O7M4aGVXEiaeE1K0KHLaPbWu',
        '202400000004',
        'user',
        'User Kedua',
        'user2@example.com',
        '081234567804',
        NULL
        ); 
`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DELETE FROM users
    WHERE id IN ('user-001','user-002','user-003','user-004');
  `);
};
