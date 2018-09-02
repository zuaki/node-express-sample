"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const db = require("./dbconnection");
const createError = require("http-errors");
const passport = require("passport");
/**
 * passport.authenticate()実行時に呼ばれる処理の登録。
 *
 * @param passportStatic PassportStatic
 */
const usePassportLocalStrategy = (passportStatic) => {
    passportStatic.serializeUser(function (username, done) {
        done(null, username);
    });
    passportStatic.deserializeUser(function (username, done) {
        done(null, username);
    });
    passportStatic.use(new passport_local_1.Strategy(
    // ログイン時にPOSTで受け取るbodyのプロパティ名と、passportで使用する認証キー名を紐づける
    // HTMLの各input要素のname属性名と紐づける必要がある
    { passReqToCallback: true, usernameField: "loginId", passwordField: "password", }, 
    // 上記で設定した値が引数に入っているので、usernameにloginIdが格納されている
    async (req, username, password, done) => {
        // 認証処理。
        // IDとPASSWORDが一致すれば認証成功。
        const query = "select * from user where loginId = '" + username + "'";
        console.log("create query = " + query);
        db.DbConnection.connectDb().query(query, (err, results, fields) => {
            // ユーザーが存在しない場合ログインページ再表示。
            if (err != null) {
                console.error("LOGIN FAILED" + err);
                return done(createError(501));
            }
            // ユーザーが存在しない、存在したがパスワードが一致しない場合画面にメッセージを表示したいので、成功を返すがloginId。
            else if (results.length == 0 || results[0].password != password) {
                return done(null, false, req.flash("errorMessage", "LOGIN IDまたはPASSWORDに誤りがあるため、ログイン出来ません。"));
            }
            // その他は成功。
            // 成功の場合は内部でreq.login()を実行してくれるのでlogin()は不要。
            else {
                return done(null, username);
            }
        });
    }));
};
/**
 * Expressでpassport機能を使用した認証処理を登録。
 *
 * @param app Express
 */
exports.useAuthMiddlewares = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    usePassportLocalStrategy(passport);
};
/**
 * passportインスタンスを返す。
 */
exports.getPassport = () => (passport);
/**
 * 認証済みチェック。
 *
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
exports.isAuthenticated = (req, res, next) => {
    // 認証済みなら次処理を実行。そうでなければindexへリダイレクト。
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        // 念の為セッションを消すようにlogout()を呼んでおく。
        // logout()はログインセッションが存在すれば削除するだけなので、悪影響はない。
        req.logout();
        res.redirect("/");
    }
};
//# sourceMappingURL=auth.js.map