import { FilterQuery } from "mongoose";
import { QuizDocument } from "../../type/quiz.type";
import { IBaseRepository } from "./IBaseRepository";

export type SearchQuiz = FilterQuery<{
    title: string;
    department: string;
    stack: string;
}>;

export interface IQuizRepository extends IBaseRepository<QuizDocument>{
find(searchQuery: SearchQuiz, skip: number, limit: number, sortOptions: any): Promise<{ quiz: QuizDocument[]; total: number; department: string[] }>
findQuizzes(): Promise<QuizDocument[]>
findQuizz(
        filterKey: string,
        filterValue: string,
        searchQuery: SearchQuiz,
        skip: number,
        limit: number,
        sortOptions: any
    ): Promise<{ quiz: QuizDocument[]; total: number; department: string[] }>
findQuiz(quizId: string): Promise<QuizDocument | null>
findLatestQuiz(instituteId: string): Promise<QuizDocument[]>
UpdateQuiz(quizData: QuizDocument, quizId: string): Promise<void>

}