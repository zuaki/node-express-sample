"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../settings/auth");
class TopRouter {
    create() {
        const router = express_1.Router();
        this.addGet(router);
        return router;
    }
    /**
     * TOPページを表示。
     *
     * @param router ExpressRouter
     */
    addGet(router) {
        // HTTPメソッドに関係なくTOPページを表示したいため、use()を使用する。
        router.use("/", 
        // 認証済みチェック
        auth_1.isAuthenticated, 
        // ページ表示処理。
        (req, res, next) => {
            res.render("top", { title: "TOP" });
        });
    }
}
exports.TopRouter = TopRouter;
//# sourceMappingURL=top.js.map