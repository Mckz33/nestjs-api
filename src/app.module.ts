import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserIdCheckMiddleware } from './middlewares/user-id-check.middlewares';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 6,
    }]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      // https://ethereal.email/create
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'bernadette.toy@ethereal.email',
          pass: 'HKrxVVDeypzD2M3RQB'
        }
      },
      defaults: {
        from: '"Mackenzie" <bernadette.toy@ethereal.email>',
      },
      template: {
        dir: __dirname + "/templates",
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [AppService]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.ALL
    });
  }

}
