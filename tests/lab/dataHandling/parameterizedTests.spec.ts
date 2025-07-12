import apiTest from "../../../src/fixtures/apiFixture";
import stepSequenceHelper from "../../../src/helpers/chaining/stepSequenceHelper";
import requestHelper from "../../../src/helpers/channel/requestHelper";
import authSteps from "../../../src/services/auth/authSteps";
import roomSteps from "../../../src/services/room/roomSteps";
import testUtils from "../../../src/utils/testUtils";
import datasets from "./parameterizedTests.data";

for (const dataset of datasets)
    apiTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
        requestHelper.openNewContext();
        authSteps.login({ user: "administrator" });
        roomSteps.createRoom({ payload: dataset.stepData.roomDetails });
        roomSteps.getRoomId({ roomName: dataset.stepData.roomDetails.roomName });
        roomSteps.deleteRoom({ tempDataIndex: dataset.stepData.roomTempDataIndex });
        await stepSequenceHelper.stepSequence;
    });