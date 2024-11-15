"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
class CartController {
    constructor(courseService) {
        this.addToCart = async (req, res, next) => {
            try {
                console.log("jai", req.cookies.userData);
                const userId = req.cookies.userData._id;
                const { courseId } = req.body;
                console.log("UserId", userId, "courseId:", courseId);
                res.status(201).json({
                    message: "Cart item fetched successfully",
                    Data: "data"
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCartItems = async (req, res, next) => {
            try {
                // console.log("userDataasdfsdf",req.cookies.userData)
                const userData = req.cookies.userData;
                console.log(userData._id);
                const items = await this.courseService.getCartItems(userData._id);
                console.log(items, "Items");
                res.status(201).json({
                    message: "Cart item fetched successfully",
                    Data: items
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.courseService = courseService;
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map