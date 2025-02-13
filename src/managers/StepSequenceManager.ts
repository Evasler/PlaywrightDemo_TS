export class StepSequenceManager {
    
    private _stepSequence: Promise<void> = Promise.resolve();
    
    get stepSequence() { return this._stepSequence; }

    addStep(step: () => Promise<void>) {
        this._stepSequence = this._stepSequence.then(step);
    }
}