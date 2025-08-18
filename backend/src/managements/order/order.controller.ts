import { Controller, UseGuards,Post, Body, Request ,Req, Param, ParseIntPipe,Get, Put, Query,Patch} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/stategies/roles.guard';
import { Roles } from 'src/utils/decoretors/role.decorator';
import { UpdateOrderDto } from './dtos/update.dto';
import { Role } from 'src/entities/role.entity';
import { SearchAndFilterOrder } from './dtos/searchAndFilter';

@Controller({
  path: 'orders', 
  version:'1'
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {
    
    
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get('me')
  async getOrderByUserId(@Req() req,
                         @Query() query:SearchAndFilterOrder) {
    const userId = req.user.id
    return await this.orderService.getOrderByUserId(userId,query)
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Post()
  async createOrder(@Body() checkoutDto:CheckoutDto,
                    @Req() req) {
    const userId = req.user.id
    return await this.orderService.createOrder(userId,checkoutDto)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get(':id')
  async getOrderByOrderId(@Param('id',ParseIntPipe) id:number) {
    return this.orderService.getOrderById(id)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user','admin')
  @Patch(':id')
  async updateOrder(@Param('id', ParseIntPipe) id: number,
                    @Body() updateDto:UpdateOrderDto) {
    return this.orderService.updateOrder(id,updateDto)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  async getAllOrder(@Query() query:SearchAndFilterOrder) {
    return await this.orderService.getAllOrder(query)
  }
  
}
