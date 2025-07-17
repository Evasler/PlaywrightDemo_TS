import { userCredentials } from "../../resources/userCredentials";

const credentialsUtils = {

    getUserCredentials(user: string) {
        const credentials = userCredentials.get(user);
        if (!credentials)
            throw new Error(`${user} doesn't exist in userCredentials.ts`);
        return credentials;
    }
};

export default credentialsUtils;