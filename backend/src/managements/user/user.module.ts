import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RoleService } from '../role/role.service';
import { RoleModule } from '../role/role.module';
import { Product } from 'src/entities/product.entity';
import { CartItems } from 'src/entities/cart-items.entity';
import { Cart } from 'src/entities/cart.entity';
@Module({
  imports:[TypeOrmModule.forFeature([User,Product,Cart]),RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
