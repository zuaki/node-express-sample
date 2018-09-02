"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DB接続(MYSQL)
const mysql = require("mysql");
/**
 * DB接続クラス。
 */
class DbConnection {
    /**
     * DB接続。
     */
    static connectDb() {
        return mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: "node-express-sample"
        });
    }
}
exports.DbConnection = DbConnection;
//# sourceMappingURL=dbconnection.js.map