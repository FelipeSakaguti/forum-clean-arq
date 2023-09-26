import { AnswersRepository } from '../repositories/answers-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionnUseCaseRequest {
  answerId: string
  authorId: string
}

interface ChooseQuestionnUseCaseResponse {
  question: Question
}

export class ChooseQuestionnUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository
  ) {}

  async execute({
    answerId,
    authorId
  }: ChooseQuestionnUseCaseRequest): Promise<ChooseQuestionnUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if(!answer){
        throw new Error('Answer not found.')
    }

    const question = await this.questionsRepository.findById(
        answer.questionId.toString()
    )

    if(!question){
        throw new Error('Question not found.')
    }

    if(authorId !== question.authorId.toString()){
        throw new Error('Not allowed')
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return {
        question,
    }
  }
}
