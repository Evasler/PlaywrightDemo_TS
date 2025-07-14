import extendedTest from "../../../src/fixtures/extendedTest";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import browserHelper from "../../../src/helpers/channel/browserHelper";
import blankSteps from "../../../src/pages/blank/blankSteps";
import loginSteps from "../../../src/pages/restfulBooker/login/loginSteps";
import testUtils from "../../../src/utils/testUtils";

extendedTest(testUtils.fullTitle(0, "Chained Page Object Model | StepSequenceBuilder"), async() => {
    browserHelper.openNewTabInNewContext();
    browserHelper.openNewTabInNewContext();
    blankSteps
    .goToRestfulBookerAdminPage(loginSteps)
    .populateCredentials("administrator")
    .clickLogin()
    .verifyLinkIsVisible("Rooms");
    browserHelper.switchWorkingTab(0, 0, "AdminPanel", "BlankPage");
    blankSteps
    .goToRestfulBookerAdminPage(loginSteps)
    .verifyLoginIsVisible();
    browserHelper.switchWorkingTab(1, 0, "AdminPanel", "AdminPanel");
    await stepSequenceHelper.stepSequence;
});