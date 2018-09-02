// DB接続(MYSQL)
import * as mysql from "mysql";

/**
 * DB接続クラス。
 */
export class DbConnection {

  /**
   * DB接続。
   */
  public static connectDb(): mysql.Connection {
    return mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      port : 3306,
      database: "node-express-sample"
    });
  }
}