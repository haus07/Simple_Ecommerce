import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class AddToCartDto {
  @IsInt()
  @Type(()=>Number)
  productId: number;
}