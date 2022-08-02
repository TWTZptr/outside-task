import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PASSWORD_REGEX, WEAK_PASSWORD_MSG } from './constants';

@ValidatorConstraint({ name: 'Password validation', async: false })
export class IsSecurePassword implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments): boolean {
    return PASSWORD_REGEX.test(text);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return WEAK_PASSWORD_MSG;
  }
}
