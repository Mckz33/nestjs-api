import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auto.controller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [JwtModule.register({
        secret: `z6%@4u;HfyIh*MHWY£)1w}24CCTnzNiM`
    }), UserModule,
        PrismaModule
    ],
    controllers: [AuthController]
})
export class AuthModule { }