import { SetMetadata } from "@nestjs/common";
import { roomtype } from "@prisma/client";

export const RoomType = (...types: roomtype[]) => SetMetadata("RoomType", types);
