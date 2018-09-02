"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db = require("../settings/dbconnection");
const createError = require("http-errors");
const auth_1 = require("../settings/auth");
class UsersRouter {
    constructor() {
        this.dbConnection = this.dbConnection = db.DbConnection.connectDb();
    }
    create() {
        const router = express_1.Router();
        this.addGetLists(router);
        return router;
    }
    /**
     * ユーザーリストを表示する
     *
     * @param router ExpressRouter
     */
    addGetLists(router) {
        router.get("/", 
        // 認証済みチェック
        auth_1.isAuthenticated, 
        // ユーザー情報表示処理。
        (req, res, next) => {
            const query = "select * from user";
            console.log("create query = " + query);
            this.dbConnection.query(query, (err, results, fields) => {
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
exports.UsersRouter = UsersRouter;
//# sourceMappingURL=users.js.map