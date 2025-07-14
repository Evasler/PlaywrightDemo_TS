import extendedTest from "../../../src/fixtures/extendedTest";
import blankSteps from "../../../src/pages/blank/blankSteps";
import adminPanelSteps from "../../../src/pages/restfulBooker/adminPanel/adminPanelSteps";
import loginSteps from "../../../src/pages/restfulBooker/login/loginSteps";
import testUtils from "../../../src/utils/testUtils";

extendedTest(testUtils.fullTitle(0, "Chained Page Object Model | StepSequenceBuilder"), async( { openNewTabInNewContext }) => {
    await openNewTabInNewContext(blankSteps)
    ._openNewTabInNewContext(blankSteps)
    .goToRestfulBookerAdminPage(loginSteps)
    .populateCredentials("administrator")
    .clickLogin()
    .verifyLinkIsVisible("Rooms")
    ._switchWorkingTab(0, 0, blankSteps)
    .goToRestfulBookerAdminPage(loginSteps)
    .verifyLoginIsVisible()
    ._switchWorkingTab(1, 0, adminPanelSteps)
    ._execute();
});