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
          NOW()::date - INTERVAL '1 month',
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
       WHERE created_at >= NOW() - INTERVAL '1 month'
       GROUP BY type
       ORDER BY total DESC
       LIMIT 7
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
      WHERE created_at >= NOW() - INTERVAL '1 month'
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
        value: defaultData.pending || 0,
        color: mapping.pending.color,
      },
      {
        name: mapping.ditolak.name,
        value: defaultData.canceled || 0,
        color: mapping.ditolak.color,
      },
      {
        name: mapping.sukses.name,
        value: defaultData.completed || 0,
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

export const getSummeryByUserId = async (req, res) => {
  try {
    const { role, id: authenticateUser } = req.user;
    const { id } = req.params;
    if (role !== "admin" && id !== authenticateUser) {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const totalQuery = {
      text: "SELECT COUNT(*) AS count FROM requests WHERE user_id = $1",
      values: [id]
    }

    const pendingQuery = {
      text: `SELECT COUNT(*) AS count FROM requests WHERE status = 'pending' AND user_id = $1`,
      values: [id]
    };

    const canceledQuery = {
      text: `SELECT COUNT(*) AS count FROM requests WHERE status = 'canceled' AND user_id = $1`,
      values: [id]
    };

    const successQuery = {
      text: `SELECT COUNT(*) AS  count FROM requests WHERE status = 'completed' AND user_id = $1`,
      values: [id]
    };

    const total = await pool.query(totalQuery);
    const pending = await pool.query(pendingQuery);
    const canceled = await pool.query(canceledQuery);
    const successed = await pool.query(successQuery)

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
