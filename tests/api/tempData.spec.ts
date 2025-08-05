import extendedTest from "../../src/fixtures/extendedTest.js";
import requestHelper from "../../src/helpers/channel/requestHelper.js";
import { authSteps, roomSteps } from "../../src/services/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest(
  testUtils.fullTitle(5, "Temporary Data", ["@fullScope"]),
  async () => {
    await requestHelper.openNewContext();
    await authSteps.login("administrator");
    await roomSteps.createRoom();
    await roomSteps.getRoomId(0);
    await roomSteps.createRoom();
    await roomSteps.getRoomId(1);
    await roomSteps.deleteRoom(0);
    await roomSteps.deleteRoom(1);
  },
);
