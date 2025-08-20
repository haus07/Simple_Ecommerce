import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItems } from 'src/entities/cart-items.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports:[OrderModule,TypeOrmModule.forFeature([CartItems]),CartModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
