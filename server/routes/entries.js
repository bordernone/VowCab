const express = require('express');
const router = express.Router();
const Entry = require('../entries/index');

router.post('/new', (req, res) => {
    var body = req.body;

    if (body.hasOwnProperty('content') && body.hasOwnProperty('entries')) {
        // we have the data. save it to database
        let thisEntry = new Entry.Entry(body.content, body.entries);
        thisEntry.save();
        res.json({ "message": "ok" });
    } else {
        res.status(401).send("Invalid post data format");
    }
});

router.get("/all", (req, res) => {
    Entry.getAllEntries()
        .then((result) => {
            res.json({ data: result });
        }, (error) => {
            res.status(401).send("Not found");
        })
        .catch(error => {
            console.log(error);
        });
})

router.delete("/:id", (req, res) => {
    var id = req.params.id;
    Entry.deleteEntry(id)
        .then(() => {
            res.json({ "message": "ok" });
        }, () => {
            res.status(401).send("No such entry");
            console.log('Cannot delete entry');
        })
        .catch((error) => {
            console.log(error);
            res.status(401).send("not permitted");
        });
});

router.get("/:id", (req, res) => {
    var id = req.params.id;
    var result;
    Entry.getEntry(id)
        .then((content) => {
            Entry.getAllDef(id)
                .then((entryDefs) => {
                    result = {
                        content: content,
                        entries: entryDefs
                    }
                    res.json(result);
                }, (error) => {
                    res.status(401).send("not found");
                })
                .catch(error => {
                    console.log(error);
                });
        }, (error) => {
            res.status(401).send("not found");
        })
        .catch(error => {
            console.log(error);
        })
});

module.exports = router;