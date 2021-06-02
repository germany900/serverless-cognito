import { signUpUser } from '../../helpers/cognito_function';

export async function registerFunction ({ username, email, password, nombre, telefono, role }) {
    let userAttr:Array<any> = [];

    userAttr.push({ Name: 'email', Value: email });
    userAttr.push({ Name: 'name', Value: nombre });
    userAttr.push({ Name: 'phone_number', Value: telefono });
    userAttr.push({ Name: 'custom:role', Value: role });

    const register = await signUpUser({
        username,
        password,
        role,
        userAttr
    });
    if(register) return true;
    else {
        return {
            err: 'Error al registrar el usuario'
        }
    }
}