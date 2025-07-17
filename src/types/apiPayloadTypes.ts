import { RoomFeature, RoomType } from "./appTypes";

export interface CreateRoomPayload {
    roomName: string;
    type: RoomType;
    accessible: boolean;
    description: string;
    image: string;
    roomPrice: number;
    features: RoomFeature[];
};