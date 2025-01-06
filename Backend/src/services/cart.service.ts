import { HttpException } from "../middleware/error.middleware";
import { CourseRepository } from "../repositories/course.repository";
import { CartDocument } from "../type/cart.type";
import { CartRepository } from "../repositories/cart.repository";
import mongoose from "mongoose";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { ICartService } from "../interfaces/IServiceInterface/ICartService";

class CartService implements ICartService {
  private courseRepository: CourseRepository;
  private cartRepository: CartRepository;



  constructor(courseRepository: CourseRepository, cartRepository: CartRepository) {
    this.courseRepository = courseRepository;
    this.cartRepository = cartRepository;
  }

  async addToCart(userId: string | null, courseId: string): Promise<any> {
    try {
      if (!courseId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      if (!userId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      let cart = await this.cartRepository.findCart(userId);

      let course = await this.courseRepository.findById(courseId);



      if (!course) {
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      const newItem = {
        course: new mongoose.Types.ObjectId(courseId),
        price: (course?.price) || 0,
        subTotal: (course?.price) || 0,
      };

      const courseExists = cart?.items.some(
        item => item.course.id.toString() === courseId
      );

      let information: string = 'Item added successfully'

      if (courseExists) {
        return information = 'Already added'
      }

      if (cart) {
        cart.items.push(newItem);
        cart.totalItems += 1;
        cart.totalPrice += course?.price || 0;
        await cart.save();
        return information
      } else {
        await this.cartRepository.createCart(
          userId,
          [newItem],
          1,
          course?.price || 0
        )
        return information
      }
    } catch (error) {
      throw error;
    }
  }

  async getCartItems(userId: string | null): Promise<CartDocument | null> {
    try {
      if (!userId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const data = await this.cartRepository.findCart(userId);
      if (!data) {
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      return data
    } catch (error) {
      throw error;
    }
  }

  async removeCart(userId: string | null, courseId: string): Promise<void> {
    try {
      if (!userId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const cart = await this.cartRepository.findCart(userId);
      if (!cart) {
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      if (cart) {
        await this.cartRepository.remove(userId, courseId)
      }

    } catch (error) {
      throw error;
    }
  }

}

export default CartService