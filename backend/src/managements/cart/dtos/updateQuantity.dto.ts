import { IsInt ,Min} from "class-validator";

export class UpdateQuantity{
    @IsInt()
    @Min(0)
    quantity:number
}