"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../settings/auth");
/**
 * 基底画面用ルーター。
 */
class IndexRouter {
    /**
     * コンストラクタ。
     *
     * @param dbConnection
     * @constructor
     */
    constructor() {
    }
    /**
     * ルーター作成。
     */
    create() {
        const router = express_1.Router();
        this.addGet(router);
        this.addLogin(router);
        return router;
    }
    /**
     * GETリクエスト用のルーターを追加する。
     *
     * @param router ExpressRouter
     */
    addGet(router) {
        router.get("/", (req, res, next) => {
            res.render("index", { title: "Login", errorMessage: req.flash("errorMessage") });
        });
    }
    /**
     * ログイン処理。
     * ユーザーのIDとPASSWORDが一致すれば認証情報をsessionにセットしてTOPページを表示する。
     *
     * @param router  ExpressRouter
     */
    addLogin(router) {
        router.post("/", 
        // 入力チェック。  
        this.loginValidation(), 
        // 認証処理。
        auth_1.getPassport().authenticate("local", { failureRedirect: "/", failureFlash: true }), 
        // authenticate()で認証処理を行い、成功であれば以下のfunctionが実行される。
        (req, res, next) => {
            // 認証成功の場合、TOPページを表示する
            res.redirect("/top");
        });
    }
    /**
     * ログイン時の入力チェック処理。
     * TODO:express-validatorミドルウェアを使用して、コード数を少なく、綺麗に書けるか検討する。
     */
    loginValidation() {
        return (req, res, next) => {
            const loginId = req.body.loginId;
            const password = req.body.password;
            // 未入力チェック
            if (!loginId || !password) {
                res.render("index", { title: "Login", errorMessage: "LOGIN ID、PASSWORDは必須入力です。" });
                return;
            }
            // 文字数チェック。
            const maxLength = 45;
            if (maxLength < loginId.length || maxLength < password.length) {
                res.render("index", { title: "Login", errorMessage: "LOGIN ID、PASSWORDは" + maxLength + "文字以内で入力して下さい。" });
                return;
            }
            // ここまできたら次の処理へ進める。
            next();
        };
    }
}
exports.IndexRouter = IndexRouter;
//# sourceMappingURL=index.js.map