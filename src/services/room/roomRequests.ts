import { createRoomPayload } from "../../../resources/payloads/createRoomPayload.js";
import requestHelper from "../../helpers/channel/requestHelper.js";
import testDataHelper from "../../helpers/data/testDataHelper.js";
import type { PostRoomHardData } from "../../types/index.js";
import roomEndpoints from "./roomEndpoints.js";

const roomRequests = {
  room: {
    get() {
      return requestHelper.workingRequestContext.get(roomEndpoints.room(), {
        headers: requestHelper.getExtraHeaders(),
      });
    },
    post(hardData: PostRoomHardData, existingRoomNames: string[]) {
      const payload = createRoomPayload(hardData, existingRoomNames);
      console.log(`Creating room "${payload.roomName}"`);
      testDataHelper.pushTestData("roomName", payload.roomName);
      testDataHelper.pushTestData("roomType", payload.type);
      testDataHelper.pushTestData("roomAccessible", String(payload.accessible));
      testDataHelper.pushTestData("roomPrice", String(payload.roomPrice));
      testDataHelper.pushTestData("roomFeatures", payload.features.join(", "));
      return requestHelper.workingRequestContext.post(roomEndpoints.room(), {
        data: payload,
        headers: requestHelper.getExtraHeaders(),
      });
    },
  },
  roomId: {
    delete(roomId: string) {
      return requestHelper.workingRequestContext.delete(
        roomEndpoints.roomId(roomId),
        { headers: requestHelper.getExtraHeaders() },
      );
    },
  },
};

export default roomRequests;
