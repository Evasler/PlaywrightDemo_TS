import { expect } from "@playwright/test";
import roomsLocators from "./roomsLocators.js";
import testDataHelper from "../../../../helpers/data/testDataHelper.js";
import { AdminHeaderSteps } from "../header/adminHeaderSteps.js";

class RoomsSteps extends AdminHeaderSteps {
  constructor() {
    super("Rooms");
  }

  verifyLinkIsVisible(name: string) {
    this.addStep(`Verifying "${name}" link is visible`, async () => {
      console.log(`Verifying "${name}" link is visible`);
      await expect(roomsLocators.link(name)).toBeVisible();
    });
    return this;
  }

  deleteRoom(tempDataIndex: number) {
    this.addStep(`Deleting Room`, async () => {
      const roomName = testDataHelper.getTestData("roomName", tempDataIndex);
      const type = testDataHelper.getTestData("roomType", tempDataIndex);
      const accessible = testDataHelper.getTestData(
        "roomAccessible",
        tempDataIndex,
      );
      const price = testDataHelper.getTestData("roomPrice", tempDataIndex);
      const features = testDataHelper.getTestData(
        "roomFeatures",
        tempDataIndex,
      );
      console.log(`Deleting Room "${roomName}"`);
      await roomsLocators
        .deleteButton(roomName, type, accessible, price, features)
        .click();
    });
    return this;
  }

  verifyRoomVisibility({
    tempDataIndex,
    shouldBeVisible,
  }: {
    tempDataIndex: number;
    shouldBeVisible: boolean;
  }) {
    this.addStep(`Verifying Room visibility`, async () => {
      const roomName = testDataHelper.getTestData("roomName", tempDataIndex);
      const type = testDataHelper.getTestData("roomType", tempDataIndex);
      const accessible = testDataHelper.getTestData(
        "roomAccessible",
        tempDataIndex,
      );
      const price = testDataHelper.getTestData("roomPrice", tempDataIndex);
      const features = testDataHelper.getTestData(
        "roomFeatures",
        tempDataIndex,
      );
      console.log(
        `Verifying Room "${roomName}" is ${shouldBeVisible ? "" : "not "}visible`,
      );
      if (shouldBeVisible)
        await expect(
          roomsLocators.row(roomName, type, accessible, price, features),
        ).toBeVisible();
      else
        await expect(
          roomsLocators.row(roomName, type, accessible, price, features),
        ).toBeHidden();
    });
    return this;
  }
}

export default new RoomsSteps();
export type { RoomsSteps };
