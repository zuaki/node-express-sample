import { Router, NextFunction, Request, Response, RequestHandler } from "express";
import { IRouter } from "./irouter";
import { getPassport } from "../settings/auth"
import * as util from "util";

/**
 * 基底画面用ルーター。
 */
export class IndexRouter implements IRouter {
  /**
   * コンストラクタ。
   * 
   * @param dbConnection 
   * @constructor
   */
  public constructor() {
  }

  /**
   * ルーター作成。
   */
  public create(): Router {
    const router = Router();
    this.addGet(router);
    this.addLogin(router);

    return router;
  }

  /**
   * GETリクエスト用のルーターを追加する。
   * 
   * @param router ExpressRouter
   */
  private addGet(router: Router) {
    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      res.render("index", { title: "Login", errorMessage: req.flash("errorMessage") });
    });
  }

  /**
   * ログイン処理。
   * ユーザーのIDとPASSWORDが一致すれば認証情報をsessionにセットしてTOPページを表示する。
   * 
   * @param router  ExpressRouter
   */
  private addLogin(router: Router) {
    router.post("/",
      // 入力チェック。  
      this.loginValidation(),

      // 認証処理。
      getPassport().authenticate("local", { failureRedirect: "/", failureFlash: true }),

      // authenticate()で認証処理を行い、成功であれば以下のfunctionが実行される。
      (req: Request, res: Response, next: NextFunction) => {
        // 認証成功の場合、TOPページを表示する
        res.redirect("/top");
      });
  }

  /**
   * ログイン時の入力チェック処理。
   * TODO:express-validatorミドルウェアを使用して、コード数を少なく、綺麗に書けるか検討する。
   */
  private loginValidation(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const loginId: string = req.body.loginId;
      const password: string = req.body.password;

      // 未入力チェック
      if (!loginId || !password) {
        res.render("index", { title: "Login", errorMessage: "LOGIN ID、PASSWORDは必須入力です。" });
        return;
      }

      // 文字数チェック。
      const maxLength: number = 45;
      if (maxLength < loginId.length || maxLength < password.length) {
        res.render("index", { title: "Login", errorMessage: "LOGIN ID、PASSWORDは" + maxLength + "文字以内で入力して下さい。" });
        return;
      }
      // ここまできたら次の処理へ進める。
      next();
    }
  }
}