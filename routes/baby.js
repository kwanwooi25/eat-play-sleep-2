const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');
const randomId = require('../utils/generateRandomID');

module.exports = app => {

  /**
   * GET
   * get all babies by user id
   */
  app.get('/api/babies', (req, res) => {
    const { userID } = req.query;

    db('babies')
      .whereRaw(`guardians @> '[{"id": "${userID}"}]'`)
      .then(babies => res.json(onSuccess(babies)))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * POST
   * add baby
   */
  app.post('/api/babies', (req, res) => {
    let baby = req.body;
    const userID = baby.guardians[0].id;

    baby.id = randomId();
    baby.guardians = JSON.stringify(baby.guardians);

    db.transaction(trx => {
      trx('babies')
        .insert(baby)
        .returning('*')
        .then(baby => {
          return trx('users')
            .where('id', '=', userID)
            .then(user => {
              if (user.length > 0) {
                user[0].settings.currentBabyId = baby[0].id;
                return trx('users')
                  .where('id', '=', userID)
                  .update(user[0])
              }
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .then(() => res.json(onSuccess('baby added successfully')))
    .catch(error => res.json(onFail(error)));
  });

  /**
   * PUT
   * edit baby
   */
  app.put('/api/babies', (req, res) => {
    let baby = req.body;
    baby.guardians = JSON.stringify(baby.guardians);

    db('babies')
      .where('id', '=', baby.id)
      .update(baby)
      .returning('*')
      .then(user => res.json(onSuccess(user[0])))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * DELETE
   * delete baby and all activities
   */
  app.delete('/api/babies', (req, res) => {
    const { babyID } = req.query;

    db.transaction(trx => {
      trx('babies')
        .where('id', '=', babyID)
        .delete()
        .then(res => {
          return trx('users')
            .whereRaw(`settings ->> 'currentBabyId' = '${babyID}'`)
            .then(users => {
              if (users.length) {
                return users.map(user => {
                  user.settings.currentBabyId = '';
                  return trx('users').where('id', '=', user.id).update(user)
                });
              }
            })
            .then(() => trx('activities').where('baby_id', '=', babyID).delete())
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .then(() => res.json(onSuccess('baby deleted successfully')))
    .catch(error => res.json(onFail(error)));
  })
}