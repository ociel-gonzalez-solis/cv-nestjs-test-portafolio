import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  createEstimate({ make, model, lat, lng, year, mileage }: GetEstimateDto) {
    return this.userRepo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('make = :make', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
