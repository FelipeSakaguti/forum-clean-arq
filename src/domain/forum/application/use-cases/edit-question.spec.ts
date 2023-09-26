import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { makeQuestion } from "test/factories/make-question"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { EditQuestionUseCase } from "./edit-question"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
    beforeEach(()=>{
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to edit a question', async() => {
        const newQuestion = makeQuestion()

        await inMemoryQuestionsRepository.create(newQuestion)

        const { question } = await sut.execute({
            authorId: newQuestion.authorId.toValue(),
            questionId: newQuestion.id.toValue(),
            content: 'Novo Conteudo',
            title: 'Novo Titulo',
        })

        expect(question).toMatchObject({
            content: 'Novo Conteudo',
            title: 'Novo Titulo'
        })
    })

    it('should not be able to delete a question from another user', async() => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1')
        })

        await inMemoryQuestionsRepository.create(newQuestion)

        expect(()=>{
            return sut.execute({
                authorId: 'author-2',
                questionId: newQuestion.id.toValue(),
                content: 'Novo Conteudo',
                title: 'Novo Titulo',
            })
        }).rejects.toBeInstanceOf(Error)
    })
})