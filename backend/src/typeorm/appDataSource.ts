import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Product } from "../entities/product.entity";
import { Cart } from "../entities/cart.entity";
import { CartItems } from "../entities/cart-items.entity";
import { Order } from "src/entities/order.entity";
import { OrderItems } from "src/entities/order-items.entity";
import "dotenv/config"

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT)||5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role, Product, Cart, CartItems,Order,OrderItems],
  synchronize: true,
});
console.log({User, Role, Product, Cart, CartItems});