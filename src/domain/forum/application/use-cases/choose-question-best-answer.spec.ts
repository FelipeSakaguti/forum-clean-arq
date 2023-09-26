import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { makeQuestion } from "test/factories/make-question"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { ChooseQuestionnUseCase } from "./choose-question-best-answer"
import { makeAnswer } from "test/factories/make-answer"
import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionnUseCase

describe('Choose Question Best Answer', () => {
    beforeEach(()=>{
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new ChooseQuestionnUseCase(inMemoryAnswersRepository,inMemoryQuestionsRepository)
    })

    it('should be able to choose question best answer', async() => {
        const newQuestion = makeQuestion()
        const newAnswer = makeAnswer({
            questionId: newQuestion.id,
        })

        await inMemoryQuestionsRepository.create(newQuestion)
        await inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: newQuestion.authorId.toString(),
        })

        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toBe(newAnswer.id)
    })

    it('should not be able to choose another user question best answer', async() => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1')
        })
        const newAnswer = makeAnswer({
            questionId: newQuestion.id,
            authorId: new UniqueEntityId('author-2')
        })

        await inMemoryQuestionsRepository.create(newQuestion)
        await inMemoryAnswersRepository.create(newAnswer)
    
        const result = await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: newAnswer.authorId.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})