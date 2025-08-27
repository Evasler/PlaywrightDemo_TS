type AzureTestRunState =
  | "Unspecified"
  | "NotStarted"
  | "InProgress"
  | "Completed"
  | "Aborted"
  | "Waiting"
  | "NeedsInvestigation";
export interface RunDetails {
  name: string;
  automated: boolean;
  plan: { id: number };
  pointIds: number[];
  state: AzureTestRunState;
  startedDate: string;
  completedDate?: string;
}
export interface ResultDetails {
  id: number;
  outcome:
    | "Unspecified"
    | "None"
    | "Passed"
    | "Failed"
    | "Inconclusive"
    | "Timeout"
    | "Aborted"
    | "Blocked"
    | "NotExecuted"
    | "Warning"
    | "Error"
    | "NotApplicable"
    | "Paused"
    | "InProgress"
    | "NotImpacted";
  state: AzureTestRunState;
  startedDate: string;
  durationInMs: number;
  errorMessage?: string;
}
