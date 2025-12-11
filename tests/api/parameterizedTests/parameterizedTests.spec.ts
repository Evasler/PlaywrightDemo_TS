import { openNewContext } from "playwrap";
import extendedTest from "../../../src/fixtures/extendedTest.js";
import { authSteps, roomSteps } from "../../../src/services/index.js";
import { testUtils } from "../../../src/utils/index.js";
import parameterizedTestsDatasets from "./parameterizedTests.data.js";

for (const dataset of parameterizedTestsDatasets)
  extendedTest(
    testUtils.fullTitle(
      dataset.testDetails.id,
      dataset.testDetails.title,
      dataset.testDetails.suiteTags,
    ),
    async () => {
      await openNewContext();
      await authSteps.login("administrator");
      await roomSteps.createRoom(dataset.stepData.createRoomArgs);
      await roomSteps.getRoomId(dataset.stepData.getRoomIdArgs);
      await roomSteps.deleteRoom(dataset.stepData.deleteRoomArgs);
    },
  );
