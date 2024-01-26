import { IsInt, IsPositive } from "class-validator";

export class FrienIdDto{
    @IsInt()
    @IsPositive()
    friend: number;
  }