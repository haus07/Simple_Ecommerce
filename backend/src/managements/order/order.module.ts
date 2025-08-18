import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItems } from 'src/entities/order-items.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order,OrderItems,User,Product])],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}
