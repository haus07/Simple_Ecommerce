import { Body, Controller, Req, UseGuards,Post,Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dtos/addToCart.dto';
import { RolesGuard } from 'src/stategies/roles.guard';
import { Roles } from 'src/utils/decoretors/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateQuantity } from './dtos/updateQuantity.dto';

@Controller({
  path: 'carts',
  version:'1'
})
export class CartController {
  constructor(private readonly cartService: CartService) {
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Post('items')
  async addToCart(@Req() req,
                  @Body() dto:AddToCartDto) {
    const userId = req.user.id
    console.log('DTO instance:', dto instanceof AddToCartDto)
    console.log(dto.productId)
    return await this.cartService.addToCart(userId,dto)
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get('me')
  async getCartById(
    @Req() req
  ) {
    const userId = req.user.id
    return await this.cartService.getCartItemsById(userId)
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Patch(':cartItemId')
  async updateQuantityByCartId(@Req() req,
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body() quantity: UpdateQuantity) {
    const userId = req.user.id
    return await this.cartService.updateQuantityByCartId(userId,cartItemId,quantity)
  }
  

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @Get('count')
  async countCartItems(@Req() req) {
    const userId = req.user.id
    return await this.cartService.countCartItems(userId)
  }
}


