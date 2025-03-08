import { AuthService } from "../services/Auth/AuthService";
import { RoomService } from "../services/Room/RoomService";
import { StepSequenceHelper } from "./StepSequenceHelper";
import { RequestHelper } from "./RequestHelper";
import { DataHelper } from "./DataHelper";

export class ServiceHelper {

    private readonly _stepSequenceHelper: StepSequenceHelper;

    private _authService?: AuthService;
    private _roomService?: RoomService;

    constructor(private readonly _requestHelper: RequestHelper, private readonly _dataHelper: DataHelper, private readonly _baseUrl: string) {
        this._stepSequenceHelper = new StepSequenceHelper();
    }
    
    get authService() {
        if (this._authService === undefined) {
            this._authService = new AuthService(this._requestHelper, this._stepSequenceHelper, this._dataHelper, this._baseUrl);
        }
        return this._authService;
    }
    
    get roomService() {
        if (this._roomService === undefined) {
            this._roomService = new RoomService(this._requestHelper, this._stepSequenceHelper, this._dataHelper, this._baseUrl);
        }
        return this._roomService;
    }
}