import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"

interface ListRecentQuestions {
    page: number
}

interface ListRecentQuestionsUseCaseResponse {
    questions: Question[]
}

export class ListRecentQuestionsUseCase {
    constructor(private questionsRepository: QuestionsRepository){}

    async execute({
        page,
    }: ListRecentQuestions): Promise<ListRecentQuestionsUseCaseResponse> {
        const questions = await this.questionsRepository.findManyRecent({
            page,
        })

        return {
            questions,
        }
    }
}