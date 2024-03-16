import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({
        secret: `z6%@4u;HfyIh*MHWY£)1w}24CCTnzNiM`
    })]
})
export class AuthModule {}