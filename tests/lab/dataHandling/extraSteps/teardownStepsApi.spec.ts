import extendedTest from "../../../../src/fixtures/extendedTest.js";
import requestHelper from "../../../../src/helpers/channel/requestHelper.js";
import authSteps from "../../../../src/services/auth/authSteps.js";
import roomSteps from "../../../../src/services/room/roomSteps.js";
import testUtils from "../../../../src/utils/testUtils.js";
import dataset from "./teardownStepsApi.data.js";

extendedTest.use({ teardownStepsArgsArray: dataset.teardownStepsArgsArray });
extendedTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
    await requestHelper.openNewContext();
    await authSteps.login(dataset.stepData.loginArgs);
    await roomSteps.createRoom(dataset.stepData.createRoomArgs);
});