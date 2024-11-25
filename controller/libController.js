const express = require('express');
const router = express.Router();
const db = require("../config/db");
const adodb = require('./adodb.class');
const response = require('../response');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function fetchRecord() {
    try {
        const result = await adodb.fetchRecords('books');
        return result;
    } catch (error) {
        response(res, 'error', error);
    }
}

//Index
router.get('/', async (req, res) => {
    try {
        const records = await fetchRecord();
        if (records) {
            res.render('index', { records: records });
        } else {
            res.render('index', { records: [] });
        }
    } catch (error) {
        response(res, 'error', error);
    }
});

async function fetchRecordById(bookId) {
    try {
        const sql = `SELECT * FROM books WHERE book_id = ${bookId}`;
        const result = await new Promise((resolve, reject) => {
            db.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        return result && result.length > 0 ? result[0] : null;
    } catch (error) {
        throw new Error(error);
    }
}

//GET ID
router.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await fetchRecordById(bookId);
        if (book) {
            res.json({
                success: true,
                data: book
            });
        } else {
            res.json({
                success: false,
                message: 'Book not found'
            });
        }
    } catch (error) {
        throw new Error(error);
    }
});

//INSERT UPDATE
router.post('/', upload.none(), async (req, res) => {
    var result = [];
    var result_data = req.body;
    var created_by = 1;
    var book_id = result_data.book_id;
    try {
        if (book_id > 0) {
            result = await adodb.updateRecords('books', book_id, result_data, created_by);
            if (result) {
                response(res, 'success', 'Record Updated Successfully', result)
            } else {
                response(res, 'error', 'Record Update Failed.')
            }
        } else {
            result = await adodb.insertRecords('books', result_data, created_by);
            var book_id = result.insertId;
            if (book_id) {
                response(res, 'success', 'Record Inserted Successfully', { result, book_id });
            } else {
                response(res, 'error', 'Record Insert Failed.');
            }
        }
    }
    catch (err) {
        response(res, 'An error occured', err);
    }
});

//DELETE
router.delete('/books/:id', async (req, res) => {
    var updated_by = 1;
    const bookId = req.params.id;
    try {
        var result = await adodb.deleteRecords('books', bookId, updated_by);
        if (result) {
            response(res, 'success', 'Record Deleted Successfully!');
        } else {
            response(res, 'error', 'Record Delete Failed.');
        }
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = router;