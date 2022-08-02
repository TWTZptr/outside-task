export const WEAK_PASSWORD_MSG: string = 'password should contain at least 1 number, one capital and one small letter';
export const PASSWORD_REGEX: RegExp = /^.*(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;