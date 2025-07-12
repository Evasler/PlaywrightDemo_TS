import terminalUtils from "./terminalUtils";

/**
 * Centralized error handling utility for standardized error reporting and handling.
 */
const errorHandlingUtils = {
    
    /**
     * Reports errors and exits the process.
     * 
     * @param context The context/source of the errors (e.g., "Azure", "Excel")
     * @param errors Array of error messages to report
     */
    reportErrors(context: string, errors: string[]) {
        if (errors.length === 0)
            return;
        terminalUtils.printColoredText(`\n${context}:`, "red");
        for (const error of errors)
            terminalUtils.printColoredText(`  ${error}`, "red");
        process.exit(1);
    },

    /**
     * Reports warnings without exiting the process.
     * 
     * @param context The context/source of the warnings (e.g., "Azure", "Excel")
     * @param warnings Array of warning messages to report
     */
    reportWarnings(context: string, warnings: string[]) {
        if (warnings.length === 0)
            return;
        terminalUtils.printColoredText(`\n${context}:`, "yellow");
        for (const warning of warnings)
            terminalUtils.printColoredText(`  ${warning}`, "yellow");
    }
};

export default errorHandlingUtils;