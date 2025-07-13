import apiTest from "../../../src/fixtures/apiFixture";
import requestHelper from "../../../src/helpers/channel/requestHelper";
import authSteps from "../../../src/services/auth/authSteps";
import roomSteps from "../../../src/services/room/roomSteps";
import testUtils from "../../../src/utils/testUtils";
import datasets from "./parameterizedTests.data";

for (const dataset of datasets)
    apiTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
        await requestHelper.openNewContext();
        await authSteps.login({ user: "administrator" });
        await roomSteps.createRoom({ payload: dataset.stepData.roomDetails });
        await roomSteps.getRoomId({ roomName: dataset.stepData.roomDetails.roomName });
        await roomSteps.deleteRoom({ tempDataIndex: dataset.stepData.roomTempDataIndex });
    });