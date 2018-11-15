const db = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DB_URL,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  }
});

const dropTableIfExists = tableName => {
  db.schema.hasTable(tableName).then(exists => {
    if (exists) {
      db.schema
        .dropTable(tableName)
        .then(() => { console.log(`TABLE DROPPED: ${tableName}`)})
        .catch(console.log)
    }
  })
}

// dropTableIfExists('login');
// dropTableIfExists('users');
// dropTableIfExists('babies');
// dropTableIfExists('activities');

/** Create 'users' table */
db.schema.hasTable('users').then(exists => {
  if (!exists) {
    db.schema.createTable('users', table => {
        table.string('id').primary().unique().notNullable();
        table.string('provider').notNullable();
        table.string('email');
        table.string('google_id');
        table.string('facebook_id');
        table.string('kakao_id');
        table.string('naver_id');
        table.jsonb('settings').defaultTo('{}');
    })
      .then(() => { console.log('TABLE CREATED: "users"') })
      .catch(console.log)
  }
});

// /** Create 'login' table */
// db.schema.hasTable('login').then(exists => {
//   if (!exists) {
//     db.schema.createTable('login', table => {
//       table.string('id').primary().unique().notNullable();
//       table.string('password').notNullable();
//     })
//       .then(() => { console.log('TABLE CREATED: "login"') })
//       .catch(console.log)
//   }
// });

/** Create 'babies' table */
db.schema.hasTable('babies').then(exists => {
  if (!exists) {
    db.schema.createTable('babies', table => {
      table.string('id').primary().unique().notNullable();
      table.string('name').notNullable();
      table.string('gender').notNullable();
      table.timestamp('birthday').notNullable();
      table.jsonb('guardians');
    })
      .then(() => { console.log('TABLE CREATED: "babies"') })
      .catch(console.log)
  }
});

/** Create 'activities' table */
db.schema.hasTable('activities').then(exists => {
  if (!exists) {
    db.schema.createTable('activities', table => {
      table.string('id').primary().unique().notNullable();
      table.string('guardian_id').notNullable();
      table.string('baby_id').notNullable();
      table.string('name').notNullable();
      table.string('type');
      table.timestamp('time_start').notNullable();
      table.integer('duration_left');
      table.integer('duration_right');
      table.integer('duration_total');
      table.integer('amount');
      // table.string('amount_unit');
      table.integer('height');
      // table.string('height_unit');
      table.integer('weight');
      // table.string('weight_unit');
      table.integer('head');
      // table.string('head_unit');
      table.string('memo');
    })
      .then(() => { console.log('TABLE CREATED: "activities"') })
      .catch(console.log)
  }
});

module.exports = db;