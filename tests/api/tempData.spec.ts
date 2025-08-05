import extendedTest from "../../src/fixtures/extendedTest.js";
import requestHelper from "../../src/helpers/channel/requestHelper.js";
import { authSteps, roomSteps } from "../../src/services/index.js";
import { testUtils } from "../../src/utils/index.js";

extendedTest(
  testUtils.fullTitle(4, "Temporary Data", ["@fullScope"]),
  async () => {
    await requestHelper.openNewContext();
    await authSteps.login({ user: "administrator" });
    await roomSteps.createRoom();
    await roomSteps.getRoomId({ tempDataIndex: 0 });
    await roomSteps.createRoom();
    await roomSteps.getRoomId({ tempDataIndex: 1 });
    await roomSteps.deleteRoom({ tempDataIndex: 0 });
    await roomSteps.deleteRoom({ tempDataIndex: 1 });
  },
);
