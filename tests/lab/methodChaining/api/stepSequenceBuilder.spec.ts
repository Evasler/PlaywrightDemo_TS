import { test as apiTest } from "../../../../src/fixtures/apiFixture";
import { TestUtils } from "../../../../src/utils/TestUtils";

apiTest(TestUtils.buildTestTitle(1, "Chained Function Object Model | StepSequenceBuilder"), async({ apiHelper }) => {
    await apiHelper.authService
    .login("administrator")
    .switchServiceCategory(apiHelper.roomService)
    .createRoom("998", "Double", "false", "Double room description", "https://www.mwtestconsultancy.co.uk/img/room1.jpg", "350", ["TV"])
    .openNewContext(apiHelper.authService, "administrator")
    .switchServiceCategory(apiHelper.roomService)
    .createRoom("999", "Family", "true", "Family room description", "https://www.mwtestconsultancy.co.uk/img/room1.jpg", "400", ["Views"])
    .execute();
});