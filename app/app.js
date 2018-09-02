"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// HTTPエラー作成時に使用する。new Error()を書かないで済む。
const createError = require("http-errors");
// Path操作用の標準モジュール。
const path = require("path");
// cookieの付与で使用する。
const cookieParser = require("cookie-parser");
// session操作で使用する。
const session = require("express-session");
const auth_1 = require("./settings/auth");
// ロガー。expressで提供しているものだが、独立モジュールになっている。
const logger = require("morgan");
// 認証エラー時にfalshを使用できるようにする。
const connectFlash = require("connect-flash");
// リクエストのルーティング用JSファイルをモジュールとして読込む。
// これを増やせば、ルーティング対象が増えることになる。
// HTTPメソッド単位の処理分けは各モジュール内で行う。
const index_1 = require("./routes/index");
const logout_1 = require("./routes/logout");
const top_1 = require("./routes/top");
const users_1 = require("./routes/users");
const user_1 = require("./routes/user");
class App {
    /**
     * アプリの起動。
     * 一般的なJSアプリにならって起動はbootstarpで実施。
     *
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    static bootstrap() {
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
    setConfig() {
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
        auth_1.useAuthMiddlewares(this.app);
        // flashを使用できるようにする。
        this.app.use(connectFlash());
        // 静的ファイルの読込み。
        this.app.use(express.static(path.join(__dirname, "public")));
    }
    /**
     * ルーターを作成。
     * URLに対応したルーターを登録する。
     */
    setRoutes() {
        // ルーティング
        this.app.use("/", new index_1.IndexRouter().create());
        this.app.use("/logout", new logout_1.LogoutRouter().create());
        this.app.use("/top", new top_1.TopRouter().create());
        this.app.use("/users", new users_1.UsersRouter().create());
        this.app.use("/user", new user_1.UserRouter().create());
    }
    /**
     * REST API用のルーターを作成。
     * 基本的にHTMLを返すので、RESTfulなAPIを作らないが、jQueryで何か処理をする際にJSON
     * で返却したい場合がありえるので、メソッドは用意している。
     */
    setApiRoutes() {
    }
    /**
     * エラーハンドラの設定。
     * ルーティング外のURIかつHTTPメソッドの場合はこのハンドラ―で処理する。
     */
    setErrorHandler() {
        // Catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            next(createError(404));
        });
        // Error handler
        this.app.use((err, req, res, next) => {
            // Set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get("env") === "development" ? err : {};
            // Render the error page
            res.status(err.status || 500);
            res.render("error");
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map