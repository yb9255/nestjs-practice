import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) throw new NotFoundException('report not found');

    report.approved = approved;

    return this.repo.save(report);
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make: estimateDto.make })
      .getRawMany();
  }
}
