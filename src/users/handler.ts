import { registerFunction } from './userFunction';

export async function register (event) {
    let { username, email, password, nombre, telefono, role } = JSON.parse(event.body);
    
    const eventRegister = await registerFunction({
        username,
        email,
        password,
        nombre,
        telefono,
        role
    });
    if(eventRegister === true) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Usuario registrado'
            })
        }
    }
    return {
        statusCode: 400,
        err: {
            message: eventRegister.err
        }
    }
}