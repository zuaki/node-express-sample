"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db = require("../settings/dbconnection");
const createError = require("http-errors");
const auth_1 = require("../settings/auth");
const util = require("util");
class UserRouter {
    constructor() {
        this.dbConnection = this.dbConnection = db.DbConnection.connectDb();
    }
    create() {
        const router = express_1.Router();
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
    addGet(router) {
        router.get("/:id?", 
        // 認証済みチェック。
        auth_1.isAuthenticated, 
        // ユーザー表示処理。
        (req, res, next) => {
            const id = req.params.id;
            // 新規登録。
            if (!id) {
                const results = [{}];
                res.render("user", { title: "User", users: results });
                return;
            }
            // 編集。
            else {
                const query = "select * from user where id = " + id;
                console.log("create query = " + query);
                this.dbConnection.query(query, (err, results, fields) => {
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
    addEdit(router) {
        router.post("/edit", 
        // 入力チェック。
        (req, res, next) => {
            const loginId = req.body.loginId;
            const password = req.body.password;
            const name = req.body.name;
            const age = req.body.age;
            const sex = req.body.sex;
            // 未入力チェック。
            if (!loginId || !password || !name || !age || !sex) {
                res.render("index", { title: "Login", errorMessage: "LOGIN ID、PASSWORD、NAME、AGE、SEXは必須入力です。" });
                return;
            }
            // 文字数チェック。
            var maxLength = 45;
            if (maxLength < loginId.length || maxLength < password.length || maxLength < name.length) {
                res.render("index", { title: "Login", errorMessage: "LOGIN ID、PASSWORD、NAMEは" + maxLength + "文字以内で入力して下さい。" });
                return;
            }
            maxLength = 2;
            if (maxLength < sex.length) {
                res.render("index", { title: "Login", errorMessage: "SEXは" + maxLength + "文字以内で入力して下さい。" });
                return;
            }
            // ここまできたら次の処理へ進める。
            next();
        }, 
        // 認証済みチェック。
        auth_1.isAuthenticated, 
        // 編集、登録処理。
        (req, res, next) => {
            const id = req.body.id;
            // IDが存在しなければ新規登録。存在すれば更新。
            if (!id) {
                this.userInsert(req, res, next);
            }
            else {
                this.userEdit(req, res, next);
            }
        });
    }
    /**
     * ユーザー情報のDB INSERT。
     */
    userInsert(req, res, next) {
        const query = util.format("insert into user (loginId, password, name, age, sex) values ('%s', '%s', '%s', '%s', '%s')", req.body.loginId, req.body.password, req.body.name, req.body.age, req.body.sex);
        console.log("create query = " + query);
        this.dbConnection.query(query, (err, results, fields) => {
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
    userEdit(req, res, next) {
        const query = util.format("update user set loginId='%s', password='%s', name='%s', age='%s', sex='%s' where id='%s';", req.body.loginId, req.body.password, req.body.name, req.body.age, req.body.sex, req.body.id);
        console.log("create query = " + query);
        this.dbConnection.query(query, (err, results, fields) => {
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
    addDelete(router) {
        router.get("/delete/:id", 
        // 認証済みチェック
        auth_1.isAuthenticated, 
        // 削除処理。
        (req, res, next) => {
            const query = util.format("delete from user where id ='%s';", req.params.id);
            console.log("create query = " + query);
            this.dbConnection.query(query, (err, results, fields) => {
                // エラー発生時はサーバーエラーをエラーハンドラに渡す。
                if (err != null) {
                    next(createError(501));
                    return;
                }
                // ユーザー一覧ページへ遷移。
                req.flash("message", "ユーザーを削除しました。");
                res.redirect("/users");
            });
        });
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=user.js.map