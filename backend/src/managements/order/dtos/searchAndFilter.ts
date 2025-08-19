
import { IsEnum, IsIn, IsInt, IsNumberString, IsOptional, IsString, MinLength } from "class-validator"
import { OrderStatus } from "src/common/enums/order-status.enum"
import { Order } from "src/entities/order.entity"


export class SearchAndFilterOrder{
            @IsString({message:'Phải là chuỗi kí tự'})
            @IsOptional()
            searchQuery?: string
            
            @IsNumberString({},{message:'Phải là số'})
            @MinLength(1,{message:'Số thự tự trang phải lớn hơn 1'})
            @IsOptional()
            page?: string
            
            @IsNumberString({},{message:'Phải là số'})
            @IsOptional()
            limit?: string
            
            @IsString({message:'Phải là chuỗi kí tự'})
            @IsIn(['createdAt', 'totalPrice',  'updatedAt'],{message:'Sắp xếp theo 1 trong các cột sau:createdAt,totalPrice,updatedAt'})
            @IsOptional()
            sortBy?: string
            
            
            @IsString({message:'Thứ tự sắp xếp phải là: desc,asc'})
            @IsIn(['asc', 'desc'])
            @IsOptional()
            sortOrder?: string
            
            @IsString({message:'Trạng thái nên là : pending,canceled,succeeded,wait for paid,confirmed'})
            @IsOptional()
            statusFilter?: string
}