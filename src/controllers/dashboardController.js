import pool from "../models/db.js";

export const getSummeryData = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const total = await pool.query("SELECT COUNT(*) AS count FROM requests");
    const pending = await pool.query(
      `SELECT COUNT(*) AS count FROM requests WHERE status = 'pending' `
    );
    const canceled = await pool.query(
      `SELECT COUNT(*) AS count FROM requests WHERE status = 'canceled'`
    );
    const successed = await pool.query(
      `SELECT COUNT(*) AS  count FROM requests WHERE status = 'completed'`
    );

    const dataSummery = [
      {
        label: "Jumlah pengajuan saat ini",
        value: Number(total.rows[0].count),
      },
      { label: "Pengajuan di proses", value: Number(pending.rows[0].count) },
      { label: "Pengajuan di tolak", value: Number(canceled.rows[0].count) },
      { label: "Pengajuan sukses", value: Number(successed.rows[0].count) },
    ];

    return res.status(200).json({
      status: "success",
      data: dataSummery,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const getDistribusiPengajuan = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }
    const result = await pool.query(`
      SELECT 
        gs::date AS date,
        COUNT(r.id) AS total
      FROM generate_series(
          NOW()::date - INTERVAL '13 days',
          NOW()::date,
          INTERVAL '1 day'
      ) AS gs
      LEFT JOIN requests r
        ON r.created_at::date = gs::date
      GROUP BY gs
      ORDER BY gs;
    `);

    const formatted = result.rows.map((row) => ({
      name: row.date.getDate().toString().padStart(2, "0"),
      uv: Number(row.total),
    }));

    return res.status(200).json({
      status: "success",
      label: "Distribusi pengajuan",
      data: formatted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const getTopRequestTypes = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }
    const result = await pool.query(`
      SELECT 
        type,
        COUNT(*) AS total
      FROM requests
      GROUP BY type
      ORDER BY total DESC
      LIMIT 7;
    `);

    const formatted = result.rows.map((row) => ({
      name: row.type,
      uv: Number(row.total),
    }));

    return res.status(200).json({
      status: "success",
      label: "Top tipe pengajuan",
      data: formatted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const getStatusPengajuan = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }
    const result = await pool.query(`
      SELECT 
        status,
        COUNT(*) AS total
      FROM requests
      WHERE created_at >= NOW() - INTERVAL '14 days'
      GROUP BY status;
    `);

    const mapping = {
      pending: { name: "Diproses", color: "#0ea5e9" },
      ditolak: { name: "Ditolak", color: "#ef4444" },
      sukses: { name: "Sukses", color: "#16a34a" },
    };

    const defaultData = {
      pending: 0,
      ditolak: 0,
      sukses: 0,
    };

    result.rows.forEach((row) => {
      defaultData[row.status] = Number(row.total);
    });

    const formatted = [
      {
        name: mapping.pending.name,
        value: defaultData.pending,
        color: mapping.pending.color,
      },
      {
        name: mapping.ditolak.name,
        value: defaultData.canceled,
        color: mapping.ditolak.color,
      },
      {
        name: mapping.sukses.name,
        value: defaultData.completed,
        color: mapping.sukses.color,
      },
    ];

    return res.status(200).json({
      status: "success",
      data: formatted,
      label: "distribusi status pengajuan",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};
