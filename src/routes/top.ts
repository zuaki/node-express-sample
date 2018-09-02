import { Router, NextFunction, Request, Response } from "express";
import { IRouter } from "./irouter";
import { isAuthenticated } from "../settings/auth";

export class TopRouter implements IRouter {
  public create(): Router {
    const router = Router();
    this.addGet(router);

    return router;
  }

  /**
   * TOPページを表示。
   * 
   * @param router ExpressRouter
   */
  private addGet(router: Router) {
    // HTTPメソッドに関係なくTOPページを表示したいため、use()を使用する。
    router.use("/",
      // 認証済みチェック
      isAuthenticated,

      // ページ表示処理。
      (req: Request, res: Response, next: NextFunction) => {
        res.render("top", { title: "TOP" });
      });
  }
}