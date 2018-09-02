import { Router, NextFunction, Request, Response } from "express";
import { IRouter } from "./irouter";

export class LogoutRouter implements IRouter {

  public create(): Router {
    const router = Router();
    this.addLogout(router);

    return router;
  }

  /**
   * ログアウト。
   * 
   * @param router ExpressRouter
   */
  private addLogout(router: Router) {
    // Httpメソッド関係なく、リクエストが来たらログアウトしたいのでuseを使用する。
    router.use("/", (req: Request, res: Response, next: NextFunction) => {
      req.logout();
      res.redirect("/");
    });
  }
}