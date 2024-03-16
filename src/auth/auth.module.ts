import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [JwtModule.register({
        secret: `z6%@4u;HfyIh*MHWY£)1w}24CCTnzNiM`
    }), UserModule,
        PrismaModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }