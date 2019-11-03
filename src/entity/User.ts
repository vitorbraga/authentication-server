import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Length, IsNotEmpty, MinLength, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";
import { PasswordReset } from "./PasswordReset";
  
@Entity()
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @IsEmail({}, { message: 'REGISTER_INVALID_EMAIL' })
    email: string;
  
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @MinLength(6, { message: "REGISTER_PASSWORD_SIX_CHARS" })
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
  
    @OneToMany(type => PasswordReset, passwordReset => passwordReset.user, { eager: true })
    passwordResets: PasswordReset[];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}