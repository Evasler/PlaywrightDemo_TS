import { test, expect } from "@playwright/test";
import type { PostRoomHardData, TestDataKeys } from "../../types/index.js";
import roomResponses from "./roomResponses.js";
import { getTestData, pushTestData } from "playwrap";

const roomSteps = {
  getAllRooms() {
    return test.step("Getting all rooms", async () => {
      console.log("Getting all rooms");
      await roomResponses.room.get._200();
    });
  },

  createRoom(hardData: PostRoomHardData = {}) {
    return test.step(`Creating room`, async () => {
      const getRoomResponseJson = await roomResponses.room.get._200();
      const existingRoomNames = getRoomResponseJson.rooms.map(
        (room) => room.roomName,
      );
      await roomResponses.room.post._200(hardData, existingRoomNames);
    });
  },

  getRoomId(tempDataIndex: number) {
    return test.step(`Getting roomId"`, async () => {
      const roomName = getTestData("roomName", tempDataIndex);
      const roomType = getTestData("roomType", tempDataIndex);
      const roomAccessible =
        getTestData("roomAccessible", tempDataIndex) === "true";
      const roomPrice = Number(getTestData("roomPrice", tempDataIndex));
      const roomFeatures = getTestData("roomFeatures", tempDataIndex);
      console.log(`Getting roomId of room "${roomName}"`);
      const responseJson = await roomResponses.room.get._200();
      const rooms = responseJson.rooms.filter(
        (room) =>
          room.roomName === roomName &&
          room.type === roomType &&
          room.accessible === roomAccessible &&
          room.roomPrice === roomPrice &&
          room.features.join(", ") === roomFeatures,
      );
      expect(rooms).toHaveLength(1);
      pushTestData("roomId", String(rooms[0].roomid));
    });
  },

  deleteRoom(tempDataIndex: number) {
    return test.step("Deleting room with roomId", async () => {
      const roomId = getTestData<TestDataKeys>("roomId", tempDataIndex);
      console.log(`Deleting room with roomId "${roomId}"`);
      await roomResponses.roomId.delete._200(roomId);
    });
  },
};

export default roomSteps;
