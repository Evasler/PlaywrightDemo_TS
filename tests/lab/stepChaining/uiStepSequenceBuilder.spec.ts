import uiTest from "../../../src/fixtures/uiFixtures";
import stepSequenceHelper from "../../../src/helpers/chaining/StepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/BrowserHelper";
import blankSteps from "../../../src/pages/Blank/BlankSteps";
import loginSteps from "../../../src/pages/RestfulBooker/Login/LoginSteps";
import testUtils from "../../../src/utils/TestUtils";

uiTest(testUtils.fullTitle(0, "Chained Page Object Model | StepSequenceBuilder"), async() => {
    browserHelper.openNewTabInNewContext();
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToRestfulBookerAdminPage(loginSteps)
    .populateCredentials("administrator")
    .clickLogin()
    .verifyLinkIsVisible("Rooms");
    browserHelper.switchWorkingTab(0, 0, "BlankPage");
    blankSteps
    .goToRestfulBookerAdminPage(loginSteps)
    .verifyLoginIsVisible();
    await stepSequenceHelper.stepSequence;
});