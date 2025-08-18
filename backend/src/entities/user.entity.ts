import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique,CreateDateColumn,DeleteDateColumn,UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { UserStatus } from "../common/enums/user-status.enum";
import { Order } from "./order.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({unique:true,type:"varchar"})
    username: string
    
    @Exclude()
    @Column({ type: "varchar" })
    password: string
    
    @Column({unique:true,type:"varchar"})
    email: string
    
    @Column({unique:true,type:"varchar"})
    phone: string

      @Column({
        type: 'enum',         
        enum: UserStatus,     
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;
    
    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
  roles: Role[]
  
  @OneToMany(() => Order, order => order.user)
  orders: Order[]
  

  @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updateAt: Date
    
    @DeleteDateColumn()
    deletedAt?: Date
}