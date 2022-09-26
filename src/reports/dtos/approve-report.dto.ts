import { IsBoolean } from 'class-validator';

export class approveReportDto {
  @IsBoolean()
  approved: boolean;
}
