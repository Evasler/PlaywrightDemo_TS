import { expect } from "@playwright/test";
import roomRequests from "./roomRequests.js";
import z from "zod";
import {
  roomFeature,
  roomType,
  type PostRoomHardData,
} from "../../types/index.js";

const roomResponses = {
  room: {
    get: {
      async _200() {
        const response = await roomRequests.room.get();
        expect(response.status()).toEqual(200);
        return z
          .strictObject({
            rooms: z.array(
              z.strictObject({
                roomid: z.number(),
                roomName: z.string(),
                type: z.literal(roomType),
                accessible: z.boolean(),
                image: z.union([
                  z.url(),
                  z.string().startsWith("/images/room").endsWith(".jpg"),
                ]),
                description: z.string(),
                features: z.array(z.literal(roomFeature)),
                roomPrice: z.number(),
              }),
            ),
          })
          .parse(await response.json());
      },
    },
    post: {
      async _200(hardData: PostRoomHardData, existingRoomNames: string[]) {
        const response = await roomRequests.room.post(
          hardData,
          existingRoomNames,
        );
        expect(response.status()).toEqual(200);
        z.strictObject({
          success: z.literal(true),
        }).parse(await response.json());
      },
    },
  },
  roomId: {
    delete: {
      async _200(roomId: string) {
        const response = await roomRequests.roomId.delete(roomId);
        expect(response.status()).toEqual(200);
        z.strictObject({
          success: z.literal(true),
        }).parse(await response.json());
      },
    },
  },
};

export default roomResponses;
