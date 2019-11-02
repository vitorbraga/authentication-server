import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Length, IsNotEmpty, MinLength } from "class-validator";
import * as bcrypt from "bcryptjs";
  
@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;
  
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @MinLength(6, {
        message: "REGISTER_PASSWORD_SIX_CHARS"
    })
    password: string;
  
    @Column()
    @IsNotEmpty()
    role: string;
  
    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}