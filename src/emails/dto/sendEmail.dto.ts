import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  subject: string;
  @ApiProperty({ example: 'example@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '<h1>Test<h1>', required: false })
  @IsString()
  @IsOptional()
  html: string;
  @ApiProperty({ example: 'test', required: false })
  @IsString()
  @IsOptional()
  text?: string;
}
