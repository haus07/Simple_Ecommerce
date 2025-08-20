import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItems } from 'src/entities/cart-items.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cart,CartItems])],
  controllers: [CartController],
  providers: [CartService],
  exports:[CartService]
})
export class CartModule {}
