import { Router, NextFunction, Request, Response } from "express";
import { IRouter } from "./irouter";
import { MysqlError, FieldInfo } from "mysql"
import * as mysql from "mysql";
import * as db from "../settings/dbconnection";
import * as createError from "http-errors";
import { isAuthenticated } from "../settings/auth";

export class UsersRouter implements IRouter {
  private dbConnection: mysql.Connection;

  public constructor() {
    this.dbConnection = this.dbConnection = db.DbConnection.connectDb();
  }

  public create(): Router {
    const router = Router();
    this.addGetLists(router);

    return router;
  }

  /**
   * ユーザーリストを表示する
   * 
   * @param router ExpressRouter
   */
  private addGetLists(router: Router) {
    router.get("/",
      // 認証済みチェック
      isAuthenticated,

      // ユーザー情報表示処理。
      (req: Request, res: Response, next: NextFunction) => {
        const query: string = "select * from user";
        console.log("create query = " + query);

        this.dbConnection.query(query, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
          // エラー発生時はサーバーエラーをエラーハンドラに渡す
          if (err != null) {
            next(createError(501));
            return;
          }

          // ユーザーリストを返す
          res.render("users", { title: "Users", users: results, message: req.flash("message") });
        });
      });
  }
}