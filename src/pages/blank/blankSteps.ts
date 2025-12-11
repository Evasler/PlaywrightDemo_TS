import type { ErrorSteps } from "../error/errorSteps.js";
import type { RoomsSteps } from "../restfulBooker/admin/rooms/roomsSteps.js";
import type { LoginSteps } from "../restfulBooker/login/loginSteps.js";
import BaseSteps from "../base/baseSteps.js";
import { addStep, baseUrl, workingTab } from "playwrap";

class BlankSteps extends BaseSteps {
  constructor() {
    super("Blank");
  }

  goToRestfulBookerAdminPage<T extends LoginSteps | RoomsSteps>(
    landingPage: T,
  ) {
    addStep("Going to Restful Booker Admin Page", async () => {
      console.log("Going to Restful Booker Admin Page");
      await workingTab().goto(`${baseUrl()}admin`);
    });
    return landingPage;
  }

  goToJsErrorPage(errorSteps: ErrorSteps) {
    addStep("Going to JavaScript Error Page", async () => {
      console.log("Going to JavaScript Error Page");
      await workingTab().goto(
        `data:text/html,<script>throw new Error("myJavaScriptError")</script>`,
      );
    });
    return errorSteps;
  }

  goToInternalServerErrorPage(errorSteps: ErrorSteps) {
    addStep("Going to Internal Server Error Page", async () => {
      console.log("Going to Internal Server Error Page");
      await workingTab().route(baseUrl(), async (route) => {
        const response = await route.fetch();
        await route.fulfill({
          response: response,
          status: 500,
        });
      });
      await workingTab().goto(baseUrl());
    });
    return errorSteps;
  }

  goToConnectionErrorPage(errorSteps: ErrorSteps) {
    addStep("Going to Connection Error Page", async () => {
      console.log("Going to Connection Error Page");
      await workingTab().route(baseUrl(), async (route) => {
        await route.abort();
      });
      await workingTab().goto(baseUrl());
    });
    return errorSteps;
  }
}

export default new BlankSteps();
export type { BlankSteps };
