import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OAuthDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
