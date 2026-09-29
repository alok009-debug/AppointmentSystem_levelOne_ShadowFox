const create = async (req, res) => {
  try {
    const { name, email, phone, service, date } = req.body;

    if (!name || !email || !phone || !service || !date) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields required' });
    }

    if (new Date(date) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: 'Date must be in the future' });
    }

    const sql = `
      INSERT INTO appointments (name, email, phone, service, date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await req.db.execute(sql, [
      name,
      email,
      phone,
      service,
      date,
      'pending',
    ]);

    res.status(201).json({
      success: true,
      data: { id: result.insertId, name, email, phone, service, date, status: 'pending' },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      'SELECT * FROM appointments ORDER BY date ASC'
    );
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      'SELECT * FROM appointments WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status value' });
    }

    const [result] = await req.db.execute(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const [rows] = await req.db.execute(
      'SELECT * FROM appointments WHERE id = ?',
      [req.params.id]
    );
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await req.db.execute(
      'DELETE FROM appointments WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { create, getAll, getOne, updateStatus, remove };