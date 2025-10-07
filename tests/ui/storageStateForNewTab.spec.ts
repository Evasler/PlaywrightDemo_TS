import extendedTest from "../../src/fixtures/extendedTest.js";
import { roomsSteps, blankSteps, loginSteps } from "../../src/pages/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest.use({
  errorListenerOptions: {
    failOnJsError: false,
    failOnConnectionError: false,
    failOnRequestError: false,
  },
});
extendedTest.describe("Initial Page without storageState", () => {
  extendedTest(
    testUtils.fullTitle(
      12,
      "Login page displayed, when the new tab is instantiated in the current context, which was instantiated without storageState",
      ["@fullScope"],
    ),
    async ({ openNewTabInNewContext }) => {
      await openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInCurrentContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    },
  );
  extendedTest(
    testUtils.fullTitle(
      13,
      "Login page displayed, when the new tab is instantiated in a new context without storageState, while previous context was instantiated without storageState",
      ["@fullScope"],
    ),
    async ({ openNewTabInNewContext }) => {
      await openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    },
  );
  extendedTest(
    testUtils.fullTitle(
      14,
      "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState, while previous context was instantiated without storageState",
      ["@fullScope"],
    ),
    async ({ openNewTabInNewContext }) => {
      await openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(roomsSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    },
  );
});

extendedTest.describe("Starting Page with storageState", () => {
  extendedTest(
    testUtils.fullTitle(
      15,
      "Admin Panel page displayed, when the new tab is instantiated in the current context, which was instantiated with storageState",
      ["@fullScope"],
    ),
    async ({ openNewTabInNewContext }) => {
      await openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(roomsSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInCurrentContext(blankSteps)
        .goToRestfulBookerAdminPage(roomsSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    },
  );
  extendedTest(
    testUtils.fullTitle(
      16,
      "Login page displayed, when the new tab is instantiated in a new context without storageState, while previous context was instantiated with storageState",
      ["@fullScope"],
    ),
    async ({ openNewTabInNewContext }) => {
      await openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(roomsSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInNewContext(blankSteps)
        .goToRestfulBookerAdminPage(loginSteps)
        .verifyLoginIsVisible()
        ._execute();
    },
  );
  extendedTest(
    testUtils.fullTitle(
      17,
      "Admin Panel page displayed, when the new tab is instantiated in a new context with storageState, while previous context was instantiated with storageState",
      ["@fullScope"],
    ),
    async ({ openNewTabInNewContext }) => {
      await openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(roomsSteps)
        .verifyLinkIsVisible("Rooms")
        ._openNewTabInNewContext(blankSteps, "administrator")
        .goToRestfulBookerAdminPage(roomsSteps)
        .verifyLinkIsVisible("Rooms")
        ._execute();
    },
  );
});
