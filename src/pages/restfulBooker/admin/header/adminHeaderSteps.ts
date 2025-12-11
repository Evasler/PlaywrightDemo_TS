import BaseSteps from "../../../base/baseSteps.js";
import headerLocators from "./adminHeaderLocators.js";
import type { RoomsSteps } from "../rooms/roomsSteps.js";
import type { ReportSteps } from "../report/reportSteps.js";
import { addStep } from "playwrap";

export abstract class AdminHeaderSteps extends BaseSteps {
  clickRoomsLink(roomsSteps: RoomsSteps) {
    addStep(`Clicking "Rooms" link`, async () => {
      console.log(`Clicking "Rooms" link`);
      await headerLocators.link("Rooms").click();
    });
    return roomsSteps;
  }

  clickReportLink(reportSteps: ReportSteps) {
    addStep(`Clicking "Report" link`, async () => {
      console.log(`Clicking "Report" link`);
      await headerLocators.link("Report").click();
    });
    return reportSteps;
  }
}
