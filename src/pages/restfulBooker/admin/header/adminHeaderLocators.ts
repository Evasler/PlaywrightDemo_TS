import browserHelper from "../../../../helpers/channel/browserHelper.js";
import type { AdminHeaderLink } from "../../../../types/index.js";

const headerLocators = {
  link(name: AdminHeaderLink) {
    return browserHelper.workingTab.getByRole("link", {
      name: name,
      exact: true,
    });
  },
};

export default headerLocators;
