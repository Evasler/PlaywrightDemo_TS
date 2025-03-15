import { test } from "../../../src/fixtures/chainedPomFixtures";
import { TestUtils } from "../../../src/utils/TestUtils";

test(TestUtils.buildTestTitle(0, "Test failure, because ErrorListener catches a JS error"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext(pageHelper.blankPage)
    .goToJsErrorPage(pageHelper.errorPage)
    .execute();
});

test(TestUtils.buildTestTitle(1, "Test failure, because ErrorListener catches an Error Status code"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext(pageHelper.blankPage)
    .goToInternalServerErrorPage(pageHelper.errorPage)
    .execute();
});

test(TestUtils.buildTestTitle(2, "Test failure, because ErrorListener catches a Connection Error"), async({ pageHelper }) => {
    await pageHelper.blankPage
    .openNewTabInNewContext(pageHelper.blankPage)
    .goToConnectionErrorPage(pageHelper.errorPage)
    .execute();
});