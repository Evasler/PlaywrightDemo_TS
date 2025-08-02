import extendedTest from "../../../src/fixtures/extendedTest.js";
import requestHelper from "../../../src/helpers/channel/requestHelper.js";
import { authSteps, roomSteps } from "../../../src/services/index.js";
import { testUtils } from "../../../src/utils/index.js";
import parameterizedTestsDatasets from "./parameterizedTests.data.js";

for (const dataset of parameterizedTestsDatasets)
    extendedTest(testUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async() => {
        await requestHelper.openNewContext();
        await authSteps.login({ user: "administrator" });
        await roomSteps.createRoom({ payload: dataset.stepData.roomDetails });
        await roomSteps.getRoomId({ roomName: dataset.stepData.roomDetails.roomName });
        await roomSteps.deleteRoom({ tempDataIndex: dataset.stepData.roomTempDataIndex });
    });