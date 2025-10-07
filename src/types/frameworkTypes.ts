export type PageType = "Blank" | "Login" | "Rooms" | "Report" | "Error";
export type TestDataKeys =
  | "token"
  | "roomId"
  | "roomName"
  | "roomType"
  | "roomAccessible"
  | "roomPrice"
  | "roomFeatures";
export type SuiteTag = "@smoke" | "@regression" | "@fullScope";
export interface StorageState {
  cookies: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
  }[];
  origins: [];
}
export interface ErrorListenerOptions {
  failOnJsError: boolean;
  failOnConnectionError: boolean;
  failOnRequestError: boolean;
}
export interface FakerConfigArgs {
  seed?: number;
  defaultRefDateISO?: string;
}
export interface ExcelReporterOptions {
  enabled: boolean;
  mandatoryReporting: boolean;
  filepath: string;
  configurationNames: string[];
}
export interface AzureReporterOptions {
  enabled: boolean;
  mandatoryReporting: boolean;
  azureBaseUrl: string;
  organizationName: string;
  projectName: string;
  personalAccessToken: string;
  runName: string;
  planId: number;
  suiteIds: number[];
  configurationNames: string[];
}
