// express本体。
import { Express, NextFunction, Request, Response } from "express";
import * as express from "express";

// HTTPエラー作成時に使用する。new Error()を書かないで済む。
import * as createError from "http-errors";
// Path操作用の標準モジュール。
import * as path from "path";
// cookieの付与で使用する。
import * as cookieParser from "cookie-parser";
// session操作で使用する。
import * as session from "express-session";
import { useAuthMiddlewares } from "./settings/auth";
// ロガー。expressで提供しているものだが、独立モジュールになっている。
import * as logger from "morgan";
// 認証エラー時にfalshを使用できるようにする。
import connectFlash = require("connect-flash");

// リクエストのルーティング用JSファイルをモジュールとして読込む。
// これを増やせば、ルーティング対象が増えることになる。
// HTTPメソッド単位の処理分けは各モジュール内で行う。
import { IndexRouter } from "./routes/index";
import { LogoutRouter } from "./routes/logout";
import { TopRouter } from "./routes/top";
import { UsersRouter } from "./routes/users";
import { UserRouter } from "./routes/user"

export class App {
  public app: Express;

  /**
   * アプリの起動。
   * 一般的なJSアプリにならって起動はbootstarpで実施。
   *
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): App {
    return new App();
  }

  /**
   * コンストラクタ。
   * 
   * @constructor
   */
  constructor() {
    this.app = express();
    this.setConfig();
    this.setRoutes();
    this.setApiRoutes();
    this.setErrorHandler();
  }

  /**
   * Expressのミドルウェア設定。
   * アプリケーションレベルのミドルウェアを設定する。
   */
  private setConfig(): void {
    // vewテンプレートエンジンの読込。
    // __dirnameは現在のソースコードのファイルパスを動的に指してくれる。
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");
    // ロガー設定。適時フォーマット部分(dev)を変更する。
    this.app.use(logger("dev"));
    // JSONを受け取れるようにする設定。
    this.app.use(express.json());
    // URLエンコードの設定。
    this.app.use(express.urlencoded({ extended: false }));
    // リクエストにcookie属性を付与してくれる。
    this.app.use(cookieParser());
    // セッション情報を登録し、passportの認証処理を設定。
    this.app.use(session({ secret: "sumple04", resave: true, saveUninitialized: true, cookie: { path: "/", maxAge: 1000 * 60 * 60 * 90 } }));
    useAuthMiddlewares(this.app);
    // flashを使用できるようにする。
    this.app.use(connectFlash());
    // 静的ファイルの読込み。
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  /**
   * ルーターを作成。
   * URLに対応したルーターを登録する。
   */
  private setRoutes(): void {
    // ルーティング
    this.app.use("/", new IndexRouter().create());
    this.app.use("/logout", new LogoutRouter().create());
    this.app.use("/top", new TopRouter().create());
    this.app.use("/users", new UsersRouter().create());
    this.app.use("/user", new UserRouter().create());
  }

  /**
   * REST API用のルーターを作成。
   * 基本的にHTMLを返すので、RESTfulなAPIを作らないが、jQueryで何か処理をする際にJSON
   * で返却したい場合がありえるので、メソッドは用意している。
   */
  private setApiRoutes(): void {
  }

  /**
   * エラーハンドラの設定。
   * ルーティング外のURIかつHTTPメソッドの場合はこのハンドラ―で処理する。
   */
  private setErrorHandler(): void {
    // Catch 404 and forward to error handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(createError(404));
    });

    // Error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      // Set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // Render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  }
}
