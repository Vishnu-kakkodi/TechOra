import { BaseRepository } from "./base.repository";
import { QuizModel } from "../models/qiiz.model";
import { QuizDocument } from "../interfaces/quiz.interface";


export class QuizRepository extends BaseRepository<QuizDocument> {
    constructor(){
        super(QuizModel);
    }

}