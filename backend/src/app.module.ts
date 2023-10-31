import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [StreamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
