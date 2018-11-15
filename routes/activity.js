const { onSuccess, onFail } = require('../utils/formatResponse');
const db = require('../database');
const randomId = require('../utils/generateRandomID');
const formSummary = require('../utils/formSummary');
const formTrendData = require('../utils/formTrendData');

module.exports = app => {

  /**
   * GET
   * get all activities by baby id
   */
  app.get('/api/activities', (req, res) => {
    const { babyID, options } = req.query;
    const { name } = JSON.parse(options);
    
    db('activities')
      .where('baby_id', '=', babyID)
      .andWhere(function() { this.whereIn('name', name) })
      .orderBy('time_start', 'desc')
      .then(activities => res.json(onSuccess(activities)))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * GET
   * get activity by id
   */
  app.get('/api/activity', (req, res) => {
    const { activityID } = req.query;
    
    db('activities')
      .where('id', '=', activityID)
      .then(activities => res.json(onSuccess(activities[0])))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * GET
   * get activity summary by date
   */
  app.get('/api/activity_summary', (req, res) => {
    const { babyID, range } = req.query;
    const { from, to } = JSON.parse(range);
    
    db('activities')
      .where('baby_id', '=', babyID)
      .andWhereBetween('time_start', [from, to])
      .then(activities => res.json(onSuccess(formSummary(activities))))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * GET
   * get activity trend by name
   */
  app.get('/api/activity_trend', (req, res) => {
    const { babyID, options } = req.query;
    const { name, from, to } = JSON.parse(options);
    
    db('activities')
      .where('baby_id', '=', babyID)
      .andWhereBetween('time_start', [from, to])
      .then(activities => res.json(onSuccess(formTrendData(activities, name, from, to))))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * POST
   * add activity
   */
  app.post('/api/activity', (req, res) => {
    let activity = req.body;

    activity.id = randomId();

    db('activities')
      .insert(activity)
      .returning('*')
      .then(activities => res.json(onSuccess(activities[0])))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * PUT
   * update activity
   */
  app.put('/api/activity', (req, res) => {
    const activity = req.body;

    db('activities')
      .where('id', '=', activity.id)
      .update(activity)
      .returning('*')
      .then(activities => res.json(onSuccess(activities[0])))
      .catch(error => res.json(onFail(error)));
  });

  /**
   * DELETE
   * delete activity
   */
  app.delete('/api/activity', (req, res) => {
    const { activityID } = req.query;

    db('activities')
      .where('id', '=', activityID)
      .delete()
      .then(result => res.json(onSuccess(`${result} item has been deleted`)))
      .catch(error => res.json(onFail(error)));
  });
}