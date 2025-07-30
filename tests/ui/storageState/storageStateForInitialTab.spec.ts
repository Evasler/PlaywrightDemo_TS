import extendedTest from "../../../src/fixtures/extendedTest.js";
import { adminPanelSteps, blankSteps, loginSteps } from "../../../src/pages/index.js";
import { testUtils } from "../../../src/utils/index.js";

extendedTest.use( { errorListenerOptions: { failOnJsError: false, failOnConnectionError: false, failOnRequestError: false } });
extendedTest.describe("Initial Tab without storageState", () => {
    extendedTest(testUtils.fullTitle(9, "Login page displayed, when initial tab is instantiated without a storageState", ["@fullScope"]), async({ openNewTabInNewContext }) => {
        await openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    });
});

extendedTest.describe("Initial Tab with storageState", () => {
    extendedTest(testUtils.fullTitle(10, "Admin Panel displayed, when initial tab is instantiated with a storageState", ["@fullScope"]), async({ openNewTabInNewContext }) => {
        await openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(adminPanelSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    });
});