import { Module } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StreamGateway ],
})
export class StreamModule {}
