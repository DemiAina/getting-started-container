const db = require('../persistence');

module.exports = async (req, res) => {
    const updateData = {
        name: req.body.name,
        completed: req.body.completed,
    };
    if (req.body.completed) {
        updateData.completedTimestamp = new Date().toISOString();
    }
    await db.updateItem(req.params.id, updateData);
    const item = await db.getItem(req.params.id);
    res.send(item);
};

