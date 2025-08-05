import { expect } from "@playwright/test";
import adminPanelLocators from "./adminPanelLocators.js";
import BaseSteps from "../../base/baseSteps.js";
import testDataHelper from "../../../helpers/data/testDataHelper.js";

class AdminPanelSteps extends BaseSteps {
  constructor() {
    super("AdminPanel");
  }

  verifyLinkIsVisible(name: string) {
    this.addStep(`Verifying "${name}" link is visible`, async () => {
      console.log(`Verifying "${name}" link is visible`);
      await expect(adminPanelLocators.link(name)).toBeVisible();
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
      await adminPanelLocators
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
          adminPanelLocators.row(roomName, type, accessible, price, features),
        ).toBeVisible();
      else
        await expect(
          adminPanelLocators.row(roomName, type, accessible, price, features),
        ).toBeHidden();
    });
    return this;
  }
}

export default new AdminPanelSteps();
export type { AdminPanelSteps };
