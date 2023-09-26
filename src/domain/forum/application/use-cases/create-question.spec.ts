import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { CreateQuestionUseCase } from "./create-question"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(()=>{
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('shoulb be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Novo titulo',
      content: 'Novo conteudo',
    })
  
    expect(question.id).toBeTruthy()
    expect(question.content).toEqual('Novo conteudo')
  })
  
})

