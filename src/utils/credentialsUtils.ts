import { userCredentials } from "../../resources/userCredentials";

const credentialsUtils = {

    getUserCredentials(user: string) {
        if (!Object.keys(userCredentials).includes(user))
            throw new Error(`${user} doesn't exist in userCredentials.ts`);
        return {
            username: userCredentials[user].username,
            password: userCredentials[user].password
        }
    }
};

export default credentialsUtils;