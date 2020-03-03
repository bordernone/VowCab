const dbConnection = require('../db/db-connection');

module.exports.Entry = class Entry {
    constructor(content, entries) {
        this.entries = entries;
        this.content = content;
    }

    setContent = (content) => {
        this.content = content;
    }

    setEntries = (entries) => {
        this.entries = entries;
    }

    getContent = () => {
        return this.content;
    }

    getEntries = () => {
        return this.entries;
    }

    save = () => {
        var _this = this;
        let newConnection = new dbConnection();
        saveEntry(newConnection, this.content)
            .then((entryId) => {
                _this.getEntries().forEach(element => {
                    saveEntryDef(newConnection, element, entryId);
                });
            })
            .catch((err) => {
                console.log(error);
            });
    }
}

const getLastEntryId = (db) => {
    return new Promise((resolve, reject) => {
        var lastid;
        let sqlQuery = `SELECT id FROM entries ORDER BY id DESC LIMIT 1`;
        db.serialize(() => {
            db.get(sqlQuery, (err, row) => {
                if (err) {
                    reject();
                    throw err;
                }
                if (row) {
                    lastid = row.id;
                    resolve(lastid);
                } else {
                    resolve(0);
                    console.log("last id not found");
                }
            });
        });
    })
};

const saveEntry = (connection, content) => {
    return new Promise((resolve, reject) => {
        var db = connection.getConnection();
        let nextId;
        getLastEntryId(db)
            .then((lastid) => {
                nextId = lastid + 1;

                db.serialize(() => {
                    db.run(`INSERT INTO entries(id, content) VALUES (?, ?)`, [nextId, content], (err) => {
                        if (err) {
                            reject();
                            console.log(err);
                        } else {
                            resolve(nextId);
                            console.log("Entries Table: New row inserted")
                        }
                    });
                });

            }, (error) => {
                reject();
                console.error(error);
            })
            .catch((error) => {
                reject();
                console.log("getLastEntry", error);
            });
    });
}

const saveEntryDef = (connection, entryDef, entryId) => {
    var db = connection.getConnection();
    db.serialize(() => {
        let query = `INSERT INTO entriesDef(entryId, startPos, endPos, definition)
                        VALUES (?, ?, ?, ?)`;
        db.run(query, [entryId, entryDef.startPos, entryDef.endPos, entryDef.def], (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("EntriesDef Table: New row inserted");
            }
        });
    })
}

const getEntry = (entryId) => {
    return new Promise((resolve, reject) => {
        var newConnection = new dbConnection();
        var db = newConnection.getConnection();

        var result;
        var content;
        db.serialize(() => {
            let query = `SELECT content FROM entries WHERE id=?`;
            db.get(query, [entryId], (err, row) => {
                if (err) {
                    reject();
                    throw err;
                } else {
                    if (row) {
                        content = row.content;
                        resolve(row.content);
                    } else {
                        reject();
                        console.log("Entry not found");
                    }
                }
            })
        });
    });
}

const getAllDef = (entryId) => {
    return new Promise((resolve, reject) => {
        var newConnection = new dbConnection();
        var db = newConnection.getConnection();

        var allEntriesDef = [];
        db.serialize(() => {
            let query = `SELECT startPos, endPos, definition FROM entriesDef WHERE entryId=?`;
            db.all(query, [entryId], (err, rows) => {
                if (err) {
                    reject();
                    throw err;
                } else {
                    if (rows) {
                        rows.forEach((row) => {
                            allEntriesDef.push({
                                startPos: row.startPos,
                                endPos: row.endPos,
                                def: row.definition
                            });
                        });

                        resolve(allEntriesDef);
                    } else {
                        reject();
                        console.log("Entry not found");
                    }
                }
            })
        });
    })
}

const deleteEntry = (entryId) => {
    return new Promise((resolve, reject) => {
        var newConnection = new dbConnection();
        var db = newConnection.getConnection();

        db.serialize(() => {
            let query = `DELETE FROM entriesDef WHERE entryId=?`;
            db.run(query, [entryId], (error) => {
                if (error){
                    reject();
                    throw error;
                } else {
                    query = `DELETE FROM entries WHERE id=?`;
                    db.run(query, [entryId], (err) => {
                        if (err){
                            reject();
                            throw err;
                        } else {
                            resolve();
                            console.log('Deleted records from entries');
                        }
                    });
                    console.log('Deleted records from entriesDef');
                }
            });
        });
    });
}

const getAllEntries = () => {
    return new Promise((resolve, reject) => {
        var newConnection = new dbConnection();
        var db = newConnection.getConnection();

        let allEntries = [];
        db.serialize(() => {
            let query = `SELECT id, content FROM entries`;
            db.all(query, (error, rows) => {
                if (error){
                    reject();
                    throw error;
                } else {
                    if (rows){
                        rows.forEach((row) => {
                            allEntries.push({
                                id: row.id,
                                content: row.content
                            });
                        });

                        resolve(allEntries);
                        console.log("Entries fetched: " + rows.length);
                    }
                }
            });
        })
    });
}

module.exports.getAllDef = getAllDef;
module.exports.getEntry = getEntry;
module.exports.deleteEntry = deleteEntry;
module.exports.getAllEntries = getAllEntries;