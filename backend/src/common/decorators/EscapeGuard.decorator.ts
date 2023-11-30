import { SetMetadata } from "@nestjs/common";
import { user_permission } from "@prisma/client";

export const Escape = () => SetMetadata('Escape', true)