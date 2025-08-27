import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = 'MyAstroJournal.db';
const database_version = '1.0';
const database_displayname = 'MyAstroJournal Database';
const database_size = 200000;

let db;

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    SQLite.echoTest()
      .then(() => {
        SQLite.openDatabase(
          database_name,
          database_version,
          database_displayname,
          database_size
        )
          .then(DB => {
            db = DB;
            db.executeSql('SELECT 1 FROM journal_entries LIMIT 1')
              .then(() => {
                // Table exists
              })
              .catch(error => {
                // Create table if it doesn't exist
                db.transaction(tx => {
                  tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS journal_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
                    []
                  );
                })
                  .catch(error => {
                    console.error('Error creating table:', error);
                  });
              });
            resolve(db);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const closeDatabase = () => {
  if (db) {
    db.close()
      .catch(error => {
        console.error('Error closing database:', error);
      });
  }
};

export const saveJournalEntry = (date, content) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO journal_entries (date, content, updated_at) VALUES (?, ?, datetime("now"))',
        [date, content]
      );
    })
      .then(() => {
        resolve();
      })
      .catch(error => {
        console.error('Error saving journal entry:', error);
        reject(error);
      });
  });
};

export const getJournalEntry = date => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM journal_entries WHERE date = ?',
        [date],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve(null);
          }
        }
      );
    })
      .catch(error => {
        console.error('Error retrieving journal entry:', error);
        reject(error);
      });
  });
};

export const getAllJournalEntries = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM journal_entries ORDER BY date DESC',
        [],
        (tx, results) => {
          const entries = [];
          for (let i = 0; i < results.rows.length; i++) {
            entries.push(results.rows.item(i));
          }
          resolve(entries);
        }
      );
    })
      .catch(error => {
        console.error('Error retrieving journal entries:', error);
        reject(error);
      });
  });
};

export const deleteJournalEntry = date => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM journal_entries WHERE date = ?', [date]);
    })
      .then(() => {
        resolve();
      })
      .catch(error => {
        console.error('Error deleting journal entry:', error);
        reject(error);
      });
  });
};
