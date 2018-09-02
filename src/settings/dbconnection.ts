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
      host: "127.0.0.1",
      user: "root",
      password: "root",
      database: "node-express-sample"
    });
  }
}