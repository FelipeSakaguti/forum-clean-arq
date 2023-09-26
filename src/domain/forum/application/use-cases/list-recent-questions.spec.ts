import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { makeQuestion } from "test/factories/make-question"
import { ListRecentQuestionsUseCase } from "./list-recent-questions"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ListRecentQuestionsUseCase

describe('List Recent Question', () => {
    beforeEach(()=>{
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to list recent questions', async() => {
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20)}))
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 18)}))
        await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 23)}))

        const { questions } = await sut.execute({ page: 1})

        expect(questions).toEqual([
            expect.objectContaining({createdAt: new Date(2022, 0 , 23) }),
            expect.objectContaining({createdAt: new Date(2022, 0 , 20) }),
            expect.objectContaining({createdAt: new Date(2022, 0 , 18) }),
        ])
    })

    it('should be able to list paginated recent questions', async() => {
        for (let i = 1; i <= 24; i++){
            await inMemoryQuestionsRepository.create(makeQuestion())
        }

        const { questions } = await sut.execute({ page: 2})

        expect(questions).toHaveLength(4)
    })

})