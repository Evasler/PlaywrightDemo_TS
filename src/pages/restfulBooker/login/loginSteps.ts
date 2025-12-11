import { expect } from "@playwright/test";
import { credentialsUtils } from "../../../utils/index.js";
import loginLocators from "./loginLocators.js";
import BaseSteps from "../../base/baseSteps.js";
import type { RoomsSteps } from "../admin/rooms/roomsSteps.js";
import { addStep } from "playwrap";

class LoginSteps extends BaseSteps {
  constructor() {
    super("Login");
  }

  verifyLoginIsVisible() {
    addStep(`Verifying "Login" is visible`, async () => {
      console.log(`Verifying "Login" is visible`);
      await expect(loginLocators.loginHeading()).toBeVisible();
    });
    return this;
  }

  populateCredentials(user: string) {
    addStep(`Populating Credentials for user "${user}"`, async () => {
      console.log(`Populating Credentials for user "${user}"`);
      const userCredentials = credentialsUtils.getUserCredentials(user);
      await loginLocators.textbox("Username").fill(userCredentials.username);
      await loginLocators.textbox("Password").fill(userCredentials.password);
    });
    return this;
  }

  clickLogin(roomsSteps: RoomsSteps) {
    addStep("Clicking Login", async () => {
      console.log("Clicking Login");
      await loginLocators.loginButton().click();
    });
    return roomsSteps;
  }
}

export default new LoginSteps();
export type { LoginSteps };
