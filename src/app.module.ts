import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserIdCheckMiddleware } from './middlewares/user-id-check.middlewares';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})
export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL
    });
  } 

}
