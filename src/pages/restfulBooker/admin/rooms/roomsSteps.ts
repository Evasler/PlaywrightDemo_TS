import roomsLocators from "./roomsLocators.js";
import { AdminHeaderSteps } from "../header/adminHeaderSteps.js";
import { addStep, getTestData } from "playwrap";
import type { TestDataKeys } from "../../../../types/index.js";
import { expect } from "@playwright/test";

class RoomsSteps extends AdminHeaderSteps {
  constructor() {
    super("Rooms");
  }

  verifyLinkIsVisible(name: string) {
    addStep(`Verifying "${name}" link is visible`, async () => {
      console.log(`Verifying "${name}" link is visible`);
      await expect(roomsLocators.link(name)).toBeVisible();
    });
    return this;
  }

  deleteRoom(tempDataIndex: number) {
    addStep(`Deleting Room`, async () => {
      const roomName = getTestData<TestDataKeys>("roomName", tempDataIndex);
      const type = getTestData<TestDataKeys>("roomType", tempDataIndex);
      const accessible = getTestData<TestDataKeys>(
        "roomAccessible",
        tempDataIndex,
      );
      const price = getTestData<TestDataKeys>("roomPrice", tempDataIndex);
      const features = getTestData<TestDataKeys>("roomFeatures", tempDataIndex);
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
    addStep(`Verifying Room visibility`, async () => {
      const roomName = getTestData<TestDataKeys>("roomName", tempDataIndex);
      const type = getTestData<TestDataKeys>("roomType", tempDataIndex);
      const accessible = getTestData<TestDataKeys>(
        "roomAccessible",
        tempDataIndex,
      );
      const price = getTestData<TestDataKeys>("roomPrice", tempDataIndex);
      const features = getTestData<TestDataKeys>("roomFeatures", tempDataIndex);
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
