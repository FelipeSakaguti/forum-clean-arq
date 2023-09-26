import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { CreateQuestionUseCase } from "./create-question"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(()=>{
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('shoul be able to create a question', async () => {

    const result = await sut.execute({
      authorId: '1',
      title: 'Novo titulo',
      content: 'Novo conteudo',
    })
  
    expect(result.isRight()).toBe(true)
    expect(result.value?.question.id).toEqual(inMemoryQuestionsRepository.items[0].id)
  })
  
})

