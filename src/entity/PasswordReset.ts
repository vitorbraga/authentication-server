import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
  
@Entity()
export class PasswordReset {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    token: string;
    
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToOne(type => User, user => user.passwordResets)
    user: User;
}