import { SetMetadata } from "@nestjs/common";
import { user_permission } from "@prisma/client";

export const RoomPermitions = (...roles: user_permission[]) => SetMetadata('RoomPermitions', roles)