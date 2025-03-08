import { StepSequenceHelper } from "../../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../../helpers/BrowserHelper";
import { BasePage } from "../../Base/BasePage";
import { DataHelper } from "../../../helpers/DataHelper";

export class AjaxDataPage extends BasePage {

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, dataHelper: DataHelper) {
        super("AjaxPage", browserHelper, stepSequenceHelper, dataHelper);
    }
}