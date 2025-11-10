import { IsEmail, IsString } from 'class-validator';

export class OAuthDto {
  @IsString()
  provider: string;

  @IsString()
  providerId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
