import { workingTab } from "playwrap";
import type { ReportCalendarButton } from "../../../../types/index.js";

const reportLocators = {
  button(name: ReportCalendarButton) {
    return workingTab().getByRole("button", {
      name: name,
      exact: true,
    });
  },
};

export default reportLocators;
