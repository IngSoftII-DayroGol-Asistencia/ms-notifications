import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EmailDto } from './email.dto';

export class SendEmailsDto {
  @ApiProperty({ example: 'test' })
  company: string;
  @ApiProperty({ example: 'test' })
  @IsString()
  subject: string;
  @ApiProperty({ type: () => [EmailDto] })
  emails: EmailDto[];
  @ApiProperty({ example: '<h1>Test<h1>', required: false })
  @IsString()
  @IsOptional()
  html: string;
  @ApiProperty({ example: 'test', required: false })
  @IsString()
  @IsOptional()
  text?: string;
}
