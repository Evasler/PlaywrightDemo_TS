import { expect } from "@playwright/test";
import adminPanelLocators from "./adminPanelLocators.js";
import BaseSteps from "../../base/baseSteps.js";

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

  deleteRoom(roomInfo: {
    roomName: string;
    type: string;
    accessible: string;
    price: string;
    roomDetails: string;
  }) {
    this.addStep(
      `Deleting Room [${roomInfo.roomName}, ${roomInfo.type}, ${roomInfo.accessible}, ${roomInfo.price}, ${roomInfo.roomDetails}]`,
      async () => {
        console.log(
          `Deleting Room [${roomInfo.roomName}, ${roomInfo.type}, ${roomInfo.accessible}, ${roomInfo.price}, ${roomInfo.roomDetails}]`,
        );
        await adminPanelLocators
          .deleteButton(
            roomInfo.roomName,
            roomInfo.type,
            roomInfo.accessible,
            roomInfo.price,
            roomInfo.roomDetails,
          )
          .click();
      },
    );
    return this;
  }

  verifyRoomVisibility(
    roomInfo: {
      roomName: string;
      type: string;
      accessible: string;
      price: string;
      roomDetails: string;
    },
    shouldBeVisible: boolean,
  ) {
    this.addStep(
      `Verifying Room [${roomInfo.roomName}, ${roomInfo.type}, ${roomInfo.accessible}, ${roomInfo.price}, ${roomInfo.roomDetails}] is ${shouldBeVisible ? "" : "not "}visible`,
      async () => {
        console.log(
          `Verifying Room [${roomInfo.roomName}, ${roomInfo.type}, ${roomInfo.accessible}, ${roomInfo.price}, ${roomInfo.roomDetails}] is ${shouldBeVisible ? "" : "not "}visible`,
        );
        if (shouldBeVisible)
          await expect(
            adminPanelLocators.row(
              roomInfo.roomName,
              roomInfo.type,
              roomInfo.accessible,
              roomInfo.price,
              roomInfo.roomDetails,
            ),
          ).toBeVisible();
        else
          await expect(
            adminPanelLocators.row(
              roomInfo.roomName,
              roomInfo.type,
              roomInfo.accessible,
              roomInfo.price,
              roomInfo.roomDetails,
            ),
          ).toBeHidden();
      },
    );
    return this;
  }
}

export default new AdminPanelSteps();
export type { AdminPanelSteps };
