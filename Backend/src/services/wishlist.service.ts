import { HttpException } from "../middleware/error.middleware";
import { CourseRepository } from "../repositories/course.repository";
import mongoose from "mongoose";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { WishlistRepository } from "../repositories/wishlist.repository";
import { WishlistDocument } from "../type/wishlist.type";
import { IWishlistService } from "../interfaces/IServiceInterface/IWishlistService";
import { ICourseRepository } from "../interfaces/IRepositoryInterface/ICourseRepository";
import { IWishlistRepository } from "../interfaces/IRepositoryInterface/IWishlistRepository";


class WishlistService implements IWishlistService {
  private courseRepository: ICourseRepository;
  private wishlistRepository: IWishlistRepository;

  constructor(courseRepository: ICourseRepository, wishlistRepository: IWishlistRepository) {
    this.courseRepository = courseRepository;
    this.wishlistRepository = wishlistRepository;
  }


  async addToWishlist(userId: string | null, courseId: string): Promise<any> {
    try {
      if (!courseId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      if (!userId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      let wishlist = await this.wishlistRepository.find(userId);

      let course = await this.courseRepository.findById(courseId);

      if (!course) {
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      const newItem = {
        course: new mongoose.Types.ObjectId(courseId),
      };

      const courseExists = wishlist?.items.some(
        item => item.course.toString() === courseId.toString()
    );

      let information: string = 'Item added successfully'

      if (courseExists) {
        return information = 'Already added'
      }

      if (wishlist) {
        wishlist.items.push(newItem);
        await wishlist.save();
        return information
      } else {
        const createdItem = {
          userId: new mongoose.Types.ObjectId(userId),
          items:[
            newItem
          ]
        }
        await this.wishlistRepository.create(createdItem)
        return information
      }

    }catch(error){
      throw error
    }
  }

  async wishlistPage(userId: string | null, page:number,limit:number,search:string): Promise<{favourates: WishlistDocument | null; total: number}> {
    try {
      if (!userId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const skip = (page - 1) * limit;
      let query:any = {};
      if (search && search.trim() !== '') {
        query.$or = [
            { title: { $regex: search, $options: 'i' } }
        ];
    }
      return await this.wishlistRepository.findFavourates(userId,query,skip,limit);
    } catch (error) {
      throw error;
    }
  }

  async removeWishlist(userId:string, courseId:string): Promise<any>{
    try{
      if (!userId) {
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      return await this.wishlistRepository.removeWishlist(userId,courseId);
    }catch(error){
      throw error;
    }
  }
}

export default WishlistService