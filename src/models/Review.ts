import { ObjectType, Int, Field } from "type-graphql";
import { ProposalStatus } from "./ProposalModel";

@ObjectType()
export class Review {
  @Field(() => Int)
  public id: number;

  @Field(() => Int)
  public proposalID: number;

  @Field(() => Int)
  public userID: number;

  @Field()
  public comment: string;

  @Field(() => Int)
  public grade: number;

  @Field(() => Int)
  public reviewerID: number;

  @Field(() => ProposalStatus)
  public status: ProposalStatus;

  constructor(
    id: number,
    proposalID: number,
    userID: number,
    comment: string,
    grade: number,
    status: number
  ) {
    this.id = id;
    this.proposalID = proposalID;
    this.userID = userID;
    this.comment = comment;
    this.grade = grade;
    this.status = status;
  }
}
