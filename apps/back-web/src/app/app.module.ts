import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RoleGuard } from '../user-management/role/guard/role.guard';
import { UserModule } from '../user-management/user/users.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    MessagingModule,
    AuthenticationModule,
    ConfigModule.forRoot()
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor
    },
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard
    },
    {
      provide: 'APP_GUARD',
      useClass: RoleGuard
    }
  ],
})
export class AppModule {}
