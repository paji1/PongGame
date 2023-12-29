import { SetMetadata } from "@nestjs/common";
import { Roomstattypes } from "src/types.ts/statustype";

export const RoomStatus = (...types: Roomstattypes[]) => SetMetadata("RoomStatus", types);
