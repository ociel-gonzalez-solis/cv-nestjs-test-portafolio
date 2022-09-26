import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private userRepo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.userRepo.create(reportDto);
    report.user = user;
    return this.userRepo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.userRepo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;
    return this.userRepo.save(report);
  }
}
