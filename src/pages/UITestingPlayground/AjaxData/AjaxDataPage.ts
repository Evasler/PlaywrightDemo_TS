import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { BasePage } from "../../Base/BasePage";
import { TempDataHelper } from "../../../helpers/TempDataHelper";

export class AjaxDataPage extends BasePage {

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("AjaxPage", browserHelper, stepSequenceHelper, tempDataHelper);
    }
}