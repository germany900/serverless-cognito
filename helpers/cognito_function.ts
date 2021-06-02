import { CognitoIdentityServiceProvider } from 'aws-sdk';
const crypto = require('crypto');

const clientId = '5pjjjs51hb6ub4fs3ukna6qmcv';
const secretHash = 'e1tjrsnql4fb8t2ojmmspkihcoo7dsls3o71hl9nngmlo9tf4c5';
const userPoolId = 'us-east-1_A47pkdpzZ';

const config = {
    region: 'us-east-1'
};

interface signUp {
    username: string,
    password: string,
    role: string,
    userAttr: Array<any>
};

interface verifyCode {
    username: string,
    code: string,
    role: string
};

type GroupParams = {
    UserPoolId: string
    GroupName: string
};

type UserParams = {
    UserPoolId: string,
    Username: string,
    GroupName: string
};

const cognitoIdentity = new CognitoIdentityServiceProvider(config);

export async function signUpUser ({ username, password, role, userAttr }: signUp) {

    const groupParams: GroupParams = {
        UserPoolId: userPoolId,
        GroupName: ''
    };
    const userParams: UserParams = {
        UserPoolId: userPoolId,
        Username: username,
        GroupName: ''
    };

    const verifyRole = ValidRole(role);
    if(verifyRole) {
        groupParams.GroupName = role,
        userParams.GroupName = role
    }

    const params = {
        ClientId: clientId,
        Username: username,
        Password: password,
        SecretHash: generateHash(username),
        UserAttributes: userAttr
    };

    try {
        const data = await cognitoIdentity.signUp(params).promise();
        console.log(data);
    } catch (e) {
        console.log(e);
    }
    
    try {
        await cognitoIdentity.getGroup(groupParams).promise();
    } catch (e) {
        await cognitoIdentity.createGroup(groupParams).promise();
    }

    try {
        const createGroup = await cognitoIdentity.adminAddUserToGroup(userParams).promise();
        console.log(createGroup);
    } catch (e) {
        console.log(e);
    }
    return true;
}

function generateHash (username:string): string {
    return crypto.createHmac('SHA256', secretHash)
        .update(username + clientId)
        .digest('base64')
}

function ValidRole (role:string): Boolean {
    const ValidRoles:Array<string> = ['ADMIN', 'CAPTURADOR', 'REPORTES'];
    const Validation:Boolean = ValidRoles.includes(role);
    return Validation;

}