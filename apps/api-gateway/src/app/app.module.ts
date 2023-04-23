import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    ClientsModule.register([
      {
        name: 'AUTHENTICATION',
        transport: Transport.TCP,
      },
      {
        name: 'USER',
        transport: Transport.TCP,
        options: {
          port: 3001,
        },
      }
    ])
  ],
})
export class AppModule {}
