const db = require("../config/db");
class adodb {
    constructor(db) {
        this.db = db;
    }

    async fetchRecords(tableName) {
        return new Promise((resolve, reject) => {
            try {
                var getRecord = `SELECT * FROM ${tableName} WHERE is_deleted = 0`;
                db.query(getRecord, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            } catch (error) {
                throw error;
            }
        });
    }

    insertRecords(tableName, data, createdBy) {
        return new Promise((resolve, reject) => {
            data.created_by = createdBy;
            var columnName = Object.keys(data).join(",");
            var fieldValue = Object.values(data).map(value => typeof value === "string" ? `'${value}'` : value).join(",");
            var insertRecord = `INSERT INTO ${tableName} (${columnName}) VALUES (${fieldValue})`;
            db.query(insertRecord, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows === 1 && result.insertId === 0) {
                        resolve({ success: true });
                    } else {
                        resolve(result);
                    }
                }
            });
        });
    }

    updateRecords(tableName, pk_id, newData, updatedBy) {
        return new Promise((resolve, reject) => {
            newData.updated_by = updatedBy;
            var currentDate = new Date();
            var time_on = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000));
            var time_format = time_on.toISOString().slice(0, 19).replace('T', ' ');
            newData.updated_on = time_format;
            try {
                db.query(`SHOW KEYS FROM ${tableName} WHERE Key_name = 'PRIMARY'`, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (result.length > 0) {
                            var primaryKey = result[0].Column_name;
                            var updateFields = Object.keys(newData).map(key => `${key}='${newData[key]}'`).join(",");
                            var updateRecord = `UPDATE ${tableName} SET ${updateFields} WHERE ${primaryKey}=${pk_id}`;
                            db.query(updateRecord, (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            });
                        }
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteRecords(tableName, pk_id, updatedBy) {
        return new Promise((resolve, reject) => {
            var currentDate = new Date();
            var time_on = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000));
            var time_format = time_on.toISOString().slice(0, 19).replace('T', ' ');
            try {
                db.query(`SHOW KEYS FROM ${tableName} WHERE Key_name = 'PRIMARY'`, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (result.length > 0) {
                            var primaryKey = result[0].Column_name;
                            var removeRecord = `UPDATE ${tableName} SET is_deleted = 1, updated_by = '${updatedBy}', updated_on = '${time_format}' WHERE ${primaryKey}=${pk_id}`;
                            db.query(removeRecord, (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            });
                        }
                    }
                });
            } catch (error) {
                throw error;
            }
        });
    }
}

module.exports = new adodb();