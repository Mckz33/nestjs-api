import { IsDateString, IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDTO {

    @IsString()
    nome: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minUppercase: 1
    })
    password: string;

    @IsOptional()
    @IsDateString()
    birthAt: string
}