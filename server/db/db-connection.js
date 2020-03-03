const sqlite3 = require('sqlite3');
const path = require('path');

const dbConnection = class DBConnection {
    constructor() {
        this.db;

        this.makeConnection();
    }

    makeConnection = () => {
        var _this = this;
        let pathname = path.join(__dirname, 'entries.db');
        let db = new sqlite3.Database(pathname, (err) => {
            if (err) {
                return console.error(err);
            }
            _this.setupTable(db);
            console.log('Connected to the SQlite database.');
        });
        this.db = db;
    }

    setupTable = () => {
        var _this = this;
        this.db.serialize(() => {
            _this.db.run('CREATE TABLE entries(id INTEGER NOT NULL PRIMARY KEY, content TEXT)', (error) => {
                if (error){
                    if (!error.message.includes('already exists')){
                        console.log(error.message);
                    }
                }
            })
        });

        this.db.serialize(() => {
            _this.db.run('CREATE TABLE entriesDef(entryId INTEGER NOT NULL, startPos INTEGER NOT NULL, endPos INTEGER NOT NULL, definition TEXT)', (error) => {
                if (error){
                    if (!error.message.includes('already exists')){
                        console.log(error.message);
                    }
                }
            })
        });
    }

    closeConnection = () => {
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    getConnection = () => {
        return this.db;
    }
}

module.exports = dbConnection;