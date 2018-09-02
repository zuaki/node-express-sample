"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class LogoutRouter {
    create() {
        const router = express_1.Router();
        this.addLogout(router);
        return router;
    }
    /**
     * ログアウト。
     *
     * @param router ExpressRouter
     */
    addLogout(router) {
        // Httpメソッド関係なく、リクエストが来たらログアウトしたいのでuseを使用する。
        router.use("/", (req, res, next) => {
            req.logout();
            res.redirect("/");
        });
    }
}
exports.LogoutRouter = LogoutRouter;
//# sourceMappingURL=logout.js.map