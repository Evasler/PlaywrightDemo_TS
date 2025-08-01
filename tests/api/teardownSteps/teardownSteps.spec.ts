import extendedTest from "../../../src/fixtures/extendedTest.js";
import requestHelper from "../../../src/helpers/channel/requestHelper.js";
import { authSteps, roomSteps } from "../../../src/services/index.js";
import { testUtils } from "../../../src/utils/index.js";
import dataset from "./teardownSteps.data.js";

extendedTest.use({ teardownStepsArgsArray: dataset.teardownStepsArgsArray });
extendedTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
    await requestHelper.openNewContext();
    await authSteps.login(dataset.stepData.loginArgs);
    await roomSteps.createRoom(dataset.stepData.createRoomArgs);
});