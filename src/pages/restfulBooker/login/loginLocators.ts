import { workingTab } from "playwrap";

const loginLocators = {
  loginHeading() {
    return workingTab().getByRole("heading", {
      name: "Login",
      exact: true,
    });
  },
  loginButton() {
    return workingTab().getByRole("button", {
      name: "Login",
      exact: true,
    });
  },
  textbox(name: string) {
    return workingTab().getByRole("textbox", {
      name: name,
      exact: true,
    });
  },
};

export default loginLocators;
