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
            host: "localhost",
            user: "root",
            password: "root",
            port: 3306,
            database: "node-express-sample"
        });
    }
}
exports.DbConnection = DbConnection;
//# sourceMappingURL=dbconnection.js.map