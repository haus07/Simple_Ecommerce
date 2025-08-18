import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Product } from "../entities/product.entity";
import { Cart } from "../entities/cart.entity";
import { CartItems } from "../entities/cart-items.entity";
import { Order } from "src/entities/order.entity";
import { OrderItems } from "src/entities/order-items.entity";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "lol009plo009",
  database: "demothuctap3",
  entities: [User, Role, Product, Cart, CartItems,Order,OrderItems],
  synchronize: true,
});
console.log({User, Role, Product, Cart, CartItems});