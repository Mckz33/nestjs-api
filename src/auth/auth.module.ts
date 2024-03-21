import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FileModule } from "../file/file.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET
        }), forwardRef(() => UserModule),
        PrismaModule,
        FileModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule { }