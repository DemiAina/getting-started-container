const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
        created: new Date().toISOString(),
    };

    await db.storeItem(item);
    res.send(item);
};
