import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { jwtModule, redisModule } from 'src/module.config';
import { ConfigModule } from '@nestjs/config';
import { PollEntity } from './polls.entity';
import { PollsGateway } from './polls.gateway';

@Module({
  imports: [redisModule, ConfigModule, jwtModule],
  controllers: [PollsController],
  providers: [PollsService, PollEntity, PollsGateway]
})
export class PollsModule {}
