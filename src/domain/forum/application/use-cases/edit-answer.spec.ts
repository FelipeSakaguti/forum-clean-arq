import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { makeAnswer } from "test/factories/make-answer"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { EditAnswerUseCase } from "./edit-answer"
import { NotAllowedError } from "./errors/not-allowed-error"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(()=>{
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to edit a answer', async() => {
        const newAnswer = makeAnswer()

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            authorId: newAnswer.authorId.toValue(),
            answerId: newAnswer.id.toValue(),
            content: 'Novo Conteudo',
        })

        expect(result.isRight()).toBe(true)
        if(result.isRight()){
            expect(result.value.answer).toMatchObject({
                content: 'Novo Conteudo',
            })
        }
    })

    it('should not be able to delete a answer from another user', async() => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1')
        })

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            authorId: 'author-2',
            answerId: newAnswer.id.toValue(),
            content: 'Novo Conteudo',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})