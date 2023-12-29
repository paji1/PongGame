import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { RoomsModule } from '../chat/rooms/rooms.module'

@Module({
  imports: [RoomsModule],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
