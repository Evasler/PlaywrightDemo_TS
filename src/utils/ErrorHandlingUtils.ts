import TerminalUtils from "./TerminalUtils";

/**
 * Centralized error handling utility for standardized error reporting and handling.
 */
export default abstract class ErrorHandlingUtils {
    /**
     * Reports errors and exits the process.
     * 
     * @param context The context/source of the errors (e.g., "Azure", "Excel")
     * @param errors Array of error messages to report
     */
    public static reportErrors(context: string, errors: string[]) {
        if (errors.length === 0)
            return;
        TerminalUtils.printColoredText(`\n${context}:`, "red");
        for (const error of errors)
            TerminalUtils.printColoredText(`  ${error}`, "red");
        process.exit(1);
    }

    /**
     * Reports warnings without exiting the process.
     * 
     * @param context The context/source of the warnings (e.g., "Azure", "Excel")
     * @param warnings Array of warning messages to report
     */
    public static reportWarnings(context: string, warnings: string[]) {
        if (warnings.length === 0)
            return;
        TerminalUtils.printColoredText(`\n${context}:`, "yellow");
        for (const warning of warnings)
            TerminalUtils.printColoredText(`  ${warning}`, "yellow");
    }
}
