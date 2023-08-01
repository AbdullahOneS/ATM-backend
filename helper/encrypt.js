import { hashSync, compareSync } from 'bcrypt';

const saltRounds = 10;

export function encrypt(pin){
    return hashSync(pin, saltRounds);
}

export function match(pin, hash){
    return compareSync(pin, hash);
}
