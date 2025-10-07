import { AdminHeaderSteps } from "../header/adminHeaderSteps.js";
import type { ReportCalendarButton } from "../../../../types/index.js";
import reportLocators from "./reportLocators.js";

class ReportSteps extends AdminHeaderSteps {
  constructor() {
    super("Report");
  }

  navigateCalendar(name: ReportCalendarButton) {
    this.addStep(`Navigating to "${name}" in the calendar`, async () => {
      console.log(`Navigating to "${name}" in the calendar`);
      await reportLocators.button(name).click();
    });
    return this;
  }
}

export default new ReportSteps();
export type { ReportSteps };
