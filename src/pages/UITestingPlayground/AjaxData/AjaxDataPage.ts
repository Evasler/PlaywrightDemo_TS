import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { BasePage } from "../../Base/BasePage";

export class AjaxDataPage extends BasePage {

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper) {
        super("AjaxPage", browserHelper, stepSequenceHelper);
    }
}