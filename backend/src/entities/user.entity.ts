import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique,CreateDateColumn,DeleteDateColumn,UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { UserStatus } from "../common/enums/user-status.enum";
import { Order } from "./order.entity";
import { Exclude } from "class-transformer";

export enum ProviderLogin  {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github'  
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({unique:true,type:"varchar"})
    username: string
    
    @Column({ type: "varchar" ,default:null})
    @Exclude()
    password: string
    
    @Column({unique:true,type:"varchar"})
    email: string
    
    @Column({unique:true,type:"varchar",default:null})
    phone: string

      @Column({
        type: 'enum',         
        enum: UserStatus,     
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;
    
    @ManyToMany(() => Role, (role) => role.users,{eager:true})
    @JoinTable()
  roles: Role[]

  @Column({
    type:'varchar',
    default:null
  })
    googleId : string

  @Column({type:'varchar',
    default:null
  })
    githubId:string
    
  @Column({
    type: 'enum',
    enum: ProviderLogin,
    default:ProviderLogin.LOCAL
    })
    provider:  ProviderLogin
  
  @OneToMany(() => Order, order => order.user)
  orders: Order[]
  

  @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updateAt: Date
    
    @DeleteDateColumn()
    deletedAt?: Date
}


