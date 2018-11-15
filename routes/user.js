const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');

module.exports = app => {

  /**
   * PUT
   * update user
   */
  app.put('/api/users', (req, res) => {
    const user = req.body;

    db('users')
      .where('id', '=', user.id)
      .update(user)
      .then(() => res.json(onSuccess('user updated successfully')))
      .catch(error => res.json(onFail(error)));
  });
}