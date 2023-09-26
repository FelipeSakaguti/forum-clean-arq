import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface ListQuestionAnswers {
    questionId: string
    page: number
}

interface ListQuestionAnswersUseCaseResponse {
    answers: Answer[]
}

export class ListQuestionAnswersUseCase {
    constructor(private answersRepository: AnswersRepository){}

    async execute({
        questionId,
        page,
    }: ListQuestionAnswers): Promise<ListQuestionAnswersUseCaseResponse> {
        const answers = await this.answersRepository.findManyByQuestionId(
            questionId,    
            { page },
        )

        return {
            answers,
        }
    }
}