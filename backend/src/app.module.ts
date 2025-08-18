import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './managements/user/user.module';
import { AuthModule } from './managements/auth/auth.module';
import { ProductModule } from './managements/product/product.module';
import { CartItems } from './entities/cart-items.entity';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { CartModule } from './managements/cart/cart.module';
import { OrderItems } from './entities/order-items.entity';
import { Order } from './entities/order.entity';
import { OrderModule } from './managements/order/order.module';
import { PaymentModule } from './managements/payment/payment.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT??5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role, Product, Cart, CartItems,Order,OrderItems],
  synchronize: true,
}),

    UserModule,AuthModule,ProductModule,CartModule,OrderModule,PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
