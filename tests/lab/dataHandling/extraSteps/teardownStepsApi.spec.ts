import extendedTest from "../../../../src/fixtures/extendedTest";
import requestHelper from "../../../../src/helpers/channel/requestHelper";
import authSteps from "../../../../src/services/auth/authSteps";
import roomSteps from "../../../../src/services/room/roomSteps";
import testUtils from "../../../../src/utils/testUtils";
import dataset from "./teardownStepsApi.data";

extendedTest.use({ teardownStepsArgsArray: dataset.teardownStepsArgsArray });
extendedTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
    await requestHelper.openNewContext();
    await authSteps.login(dataset.stepData.loginArgs);
    await roomSteps.createRoom(dataset.stepData.createRoomArgs);
});