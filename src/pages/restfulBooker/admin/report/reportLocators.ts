import browserHelper from "../../../../helpers/channel/browserHelper.js";
import type { ReportCalendarButton } from "../../../../types/index.js";

const reportLocators = {
  button(name: ReportCalendarButton) {
    return browserHelper.workingTab.getByRole("button", {
      name: name,
      exact: true,
    });
  },
};

export default reportLocators;
