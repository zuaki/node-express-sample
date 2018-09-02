import { Router, NextFunction, Request, Response } from "express";
import { IRouter } from "./irouter";
import { MysqlError, FieldInfo } from "mysql"
import * as mysql from "mysql";
import * as db from "../settings/dbconnection";
import * as createError from "http-errors";
import { isAuthenticated } from "../settings/auth";
import * as util from "util";

export class UserRouter implements IRouter {
  private dbConnection: mysql.Connection;

  public constructor() {
    this.dbConnection = this.dbConnection = db.DbConnection.connectDb();
  }

  public create(): Router {
    const router = Router();
    this.addGet(router);
    this.addEdit(router);
    this.addDelete(router);

    return router;
  }

  /**
   * ユーザーを表示する
   * 
   * @param router ExpressRouter
   */
  private addGet(router: Router): void {
    router.get("/:id?",
      // 認証済みチェック。
      isAuthenticated,

      // ユーザー表示処理。
      (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id;

        // 新規登録。
        if (!id) {
          const results: any = [{}];
          res.render("user", { title: "User", users: results });
          return;
        }
        // 編集。
        else {
          const query: string = "select * from user where id = " + id;
          console.log("create query = " + query);

          this.dbConnection.query(query, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
            // エラー発生時はサーバーエラーをエラーハンドラに渡す
            if (err != null) {
              next(createError(501));
              return;
            }

            // ユーザーを返す
            res.render("user", { title: "User", users: results });
          });
        }
      });
  }

  /**
   * ユーザーを編集する。
   * 
   * @param router ExpressRouter
   */
  private addEdit(router: Router): void {
    router.post("/edit",
      // 入力チェック。
      (req: Request, res: Response, next: NextFunction) => {
        const loginId: string = req.body.loginId;
        const password: string = req.body.password;
        const name: string = req.body.name;
        const age: number = req.body.age;
        const sex: string = req.body.sex;

        // 未入力チェック。
        if (!loginId || !password || !name || !age || !sex) {
          res.render("user", { title: "Login", errorMessage: "LOGIN ID、PASSWORD、NAME、AGE、SEXは必須入力です。" });
          return;
        }
        // 文字数チェック。
        var maxLength: number = 45;
        if (maxLength < loginId.length || maxLength < password.length || maxLength < name.length) {
          res.render("user", { title: "Login", errorMessage: "LOGIN ID、PASSWORD、NAMEは" + maxLength + "文字以内で入力して下さい。" });
          return;
        }
        maxLength = 2;
        if (maxLength < sex.length) {
          res.render("user", { title: "Login", errorMessage: "SEXは" + maxLength + "文字以内で入力して下さい。" });
          return;
        }

        // ここまできたら次の処理へ進める。
        next();
      },

      // 認証済みチェック。
      isAuthenticated,

      // 編集、登録処理。
      (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.body.id;

        // IDが存在しなければ新規登録。存在すれば更新。
        if (!id) {
          this.userInsert(req, res, next);
        }
        else {
          this.userEdit(req, res, next);
        }
      }
    );
  }

  /**
   * ユーザー情報のDB INSERT。
   */
  private userInsert(req: Request, res: Response, next: NextFunction): void {
    const query: string = util.format("insert into user (loginId, password, name, age, sex) values ('%s', '%s', '%s', '%s', '%s')",
      req.body.loginId, req.body.password, req.body.name, req.body.age, req.body.sex);
    console.log("create query = " + query);

    this.dbConnection.query(query, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
      // エラー発生時はサーバーエラーをエラーハンドラに渡す。
      if (err != null) {
        next(createError(501));
        return;
      }

      // ユーザー一覧ページへ遷移。
      req.flash("message", "ユーザーを登録しました。");
      res.redirect("/users");
    });
  }

  /**
   * ユーザー情報のDB UPDATE。
   */
  private userEdit(req: Request, res: Response, next: NextFunction): void {
    const query: string = util.format("update user set loginId='%s', password='%s', name='%s', age='%s', sex='%s' where id='%s';",
      req.body.loginId, req.body.password, req.body.name, req.body.age, req.body.sex, req.body.id);
    console.log("create query = " + query);

    this.dbConnection.query(query, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
      // エラー発生時はサーバーエラーをエラーハンドラに渡す。
      if (err != null) {
        next(createError(501));
        return;
      }

      // ユーザー一覧ページへ遷移。
      req.flash("message", "ユーザーを更新しました。");
      res.redirect("/users");
    });
  }

  /**
   * ユーザーを削除する。
   * 
   * @param router ExpressRouter
   */
  private addDelete(router: Router): void {
    router.get("/delete/:id",
      // 認証済みチェック
      isAuthenticated,

      // 削除処理。
      (req: Request, res: Response, next: NextFunction) => {
        const query: string = util.format("delete from user where id ='%s';", req.params.id);
        console.log("create query = " + query);

        this.dbConnection.query(query, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
          // エラー発生時はサーバーエラーをエラーハンドラに渡す。
          if (err != null) {
            next(createError(501));
            return;
          }

          // ユーザー一覧ページへ遷移。
          req.flash("message", "ユーザーを削除しました。");
          res.redirect("/users");
        });
      }
    );
  }
}