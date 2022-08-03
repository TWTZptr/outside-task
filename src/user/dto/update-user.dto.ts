import { PartialType } from "@nestjs/mapped-types";
import { SigninDto } from "../../auth/dto/signin.dto";

export class UpdateUserDto extends PartialType(SigninDto) {
}
