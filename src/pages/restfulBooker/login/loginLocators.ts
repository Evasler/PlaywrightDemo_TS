import { browserHelper } from "../../../helpers/index.js";

const loginLocators = {
    loginHeading() { return browserHelper.workingTab.getByRole("heading", { name: "Login", exact: true }); },
    loginButton() { return browserHelper.workingTab.getByRole("button", { name: "Login", exact: true }); },
    textbox(name: string) { return browserHelper.workingTab.getByRole("textbox", { name: name, exact: true }); }
};

export default loginLocators;