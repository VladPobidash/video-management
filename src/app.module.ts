import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: 5432,
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        extra: {
          ssl: true,
        },
      }),
      inject: [ConfigService],
    }),
    VideosModule,
    GroupsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
