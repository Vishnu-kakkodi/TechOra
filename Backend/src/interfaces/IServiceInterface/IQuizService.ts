import { QuizDocument } from "../../type/quiz.type";



export interface IQuizService{
    createQuiz(quizData: QuizDocument,tutorId: string): Promise<unknown>
    quizList(page:number,limit:number,search:string,department:string,sort:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }>
    listQuiz(institutionId:string,page:number,limit:number,search:string,department:string,sort:string,selectedStatus:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }>
    TutorListQuiz(tutorId:string,page:number,limit:number,search:string,department:string,sort:string,selectedStatus:string): Promise<{ quiz: QuizDocument[]; total: number; department:string[] }>
    quizDetail(quizId: string): Promise<QuizDocument|null>
    updateQuiz(quizData: QuizDocument,quizId:string): Promise<void>
    findQuiz(instituteId: string): Promise<QuizDocument[]>
    quizResult(userId: string, mark: string, quizId: string): Promise<void>
}