import extendedTest from "../../../src/fixtures/extendedTest.js";
import { stepSequenceHelper } from "../../../src/helpers/index.js";
import { adminPanelSteps, blankSteps, loginSteps } from "../../../src/pages/index.js";
import { testUtils } from "../../../src/utils/index.js";

extendedTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
extendedTest.describe("Initial Page without storageState", () => {
    extendedTest(testUtils.fullTitle(0, "Login page displayed, when the new tab is instantiated in the current context, which was instantiated without storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInCurrentContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(1, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(2, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
});

extendedTest.describe("Starting Page with storageState", () => {
    extendedTest(testUtils.fullTitle(3, "Admin Panel page displayed, when the new tab is instantiated in the current context, which was instantiated with storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInCurrentContext(blankSteps)
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(4, "Login page displayed, when the new tab is instantiated in a new context without storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible();
        await stepSequenceHelper.stepSequence;
    });
    extendedTest(testUtils.fullTitle(5, "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState"), async({ openNewTabInNewContext }) => {
        openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms");
        await stepSequenceHelper.stepSequence;
    });
});
