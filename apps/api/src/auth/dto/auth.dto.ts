/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class RequestCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+7\d{10}$/, {
    message: 'Номер должен быть в формате +79991234567',
  })
  phone: string;
}

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+7\d{10}$/)
  phone: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
