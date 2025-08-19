import { IsEnum } from "class-validator";
import { OrderStatus } from "src/common/enums/order-status.enum";

export class UpdateOrderDto{
    @IsEnum(OrderStatus,{message:'Trạng thái nên là : pending,canceled,succeeded,wait for paid,confirmed'})
    status:OrderStatus

    
}