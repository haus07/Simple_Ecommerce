import { Controller, ParseIntPipe, Patch, Query, UseGuards, UsePipes, ValidationPipe,Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/stategies/roles.guard';
import { Roles } from 'src/utils/decoretors/role.decorator';
import { UpdateProduct } from './dtos/updateProduct.dto';
import { SearchAndFilterProduct } from './dtos/searchAndFilterProduct.dto';

@Controller({
  path: 'products',
  version:'1'
})
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  

  @Get('')
  async getAllProduct(@Query() query:SearchAndFilterProduct) {
    return await this.productService.getAllProduct(query)
  }

  @Get(':id')
  async getOneProduct(@Param('id',ParseIntPipe) id:number) {
    return await this.productService.getOneProduct(id)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateProduct(@Param('id', ParseIntPipe,) id: number,
                      @Body() updateData:UpdateProduct) {
    return await this.productService.updateProduct(id,updateData)
  }
}
