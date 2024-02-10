import { IsString, Length, IsInt, IsOptional } from "class-validator"

export class CreatePollDto{
    @IsString()
    @Length(2, 60)
    user: string

    @IsString()
    @Length(4, 100)
    question: string

    @IsInt()
    noOfVotes: number
}

export class JoinPollDto{

    @IsString()
    @Length(2, 60)
    user: string

    @IsString()
    pollId: string
}