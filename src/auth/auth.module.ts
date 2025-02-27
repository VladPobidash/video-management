import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME'),
          },
        };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'APP_GUARD',
      useExisting: JwtAuthGuard,
    },
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
