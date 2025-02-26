import { AuthService } from "../services/Auth/AuthService";
import { RoomService } from "../services/Room/RoomService";
import { RequestHelper } from "./RequestHelper";
import { StorageStateHelper } from "./StorageStateHelper";
import { StepSequenceHelper } from "./StepSequenceHelper";

export class ApiHelper {

    private readonly _stepSequenceHelper: StepSequenceHelper;
    private readonly _storageStateHelper: StorageStateHelper;

    private _authService?: AuthService;
    private _roomService?: RoomService;

    constructor(private readonly _requestHelper: RequestHelper, private readonly _baseUrl: string) {
        this._stepSequenceHelper = new StepSequenceHelper();
        this._storageStateHelper = new StorageStateHelper(this._baseUrl);
    }
    
    get authService() {
        if (this._authService === undefined) {
            this._authService = new AuthService(this._requestHelper, this._stepSequenceHelper, this._storageStateHelper, this._baseUrl);
        }
        return this._authService;
    }
    
    get roomService() {
        if (this._roomService === undefined) {
            this._roomService = new RoomService(this._requestHelper, this._stepSequenceHelper, this._storageStateHelper, this._baseUrl);
        }
        return this._roomService;
    }
}