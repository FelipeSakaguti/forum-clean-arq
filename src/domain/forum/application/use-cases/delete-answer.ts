import { AnswersRepository } from "../repositories/answers-repository";

interface DeleteAnswerUseCaseRequest{
    authorId: string
    answerId: string
}

interface DeleteAnswerUseCaseResponse{}

export class DeleteAnswerUseCase{
    constructor(private answersRepository: AnswersRepository){}

    async execute({
        authorId,
        answerId
    }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse>{
        const Answer = await this.answersRepository.findById(answerId)

        if(!Answer){
            throw new Error('Answer not found.')
        }

        if(authorId !== Answer.authorId.toString()){
            throw new Error('Not allowed.')
        }

        await this.answersRepository.delete(Answer)

        return {}
    }

}