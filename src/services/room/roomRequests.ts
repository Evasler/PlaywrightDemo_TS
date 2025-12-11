import postRoomPayload from "./payloads/postRoomPayload.js";
import type { PostRoomHardData } from "../../types/index.js";
import roomEndpoints from "./roomEndpoints.js";
import { getExtraHeaders, pushTestData, workingRequestContext } from "playwrap";

const roomRequests = {
  room: {
    get() {
      return workingRequestContext().get(roomEndpoints.room(), {
        headers: getExtraHeaders(),
      });
    },
    post(hardData: PostRoomHardData, existingRoomNames: string[]) {
      const payload = postRoomPayload(hardData, existingRoomNames);
      console.log(`Creating room "${payload.roomName}"`);
      pushTestData("roomName", payload.roomName);
      pushTestData("roomType", payload.type);
      pushTestData("roomAccessible", String(payload.accessible));
      pushTestData("roomPrice", String(payload.roomPrice));
      pushTestData("roomFeatures", payload.features.join(", "));
      return workingRequestContext().post(roomEndpoints.room(), {
        data: payload,
        headers: getExtraHeaders(),
      });
    },
  },
  roomId: {
    delete(roomId: string) {
      return workingRequestContext().delete(roomEndpoints.roomId(roomId), {
        headers: getExtraHeaders(),
      });
    },
  },
};

export default roomRequests;
