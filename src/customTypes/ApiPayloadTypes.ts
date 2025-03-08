import { RoomFeature, RoomType } from "./AppTypes";

export type CreateRoomPayload = {
    roomName: string;
    type: RoomType;
    accessible: boolean;
    description: string;
    image: string;
    roomPrice: number;
    features: RoomFeature[];
};