import { workingTab } from "playwrap";
import type { AdminHeaderLink } from "../../../../types/index.js";

const headerLocators = {
  link(name: AdminHeaderLink) {
    return workingTab().getByRole("link", {
      name: name,
      exact: true,
    });
  },
};

export default headerLocators;
