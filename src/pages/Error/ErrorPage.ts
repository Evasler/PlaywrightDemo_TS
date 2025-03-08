import { BrowserHelper } from "../../helpers/BrowserHelper";
import { DataHelper } from "../../helpers/DataHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BasePage } from "../Base/BasePage";

export class ErrorPage extends BasePage {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, dataHelper: DataHelper) {
        super("Error", browserHelper, stepSequenceHelper, dataHelper);
    }
}