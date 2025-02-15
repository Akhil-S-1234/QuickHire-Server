import { ReportedJobRepository } from '../../../domain/repositories/ReportedJobRepository';
import { JobRepository } from '../../../domain/repositories/JobRepository';


export class ReportedJobUseCase {
    constructor(
        private reportedJobRepository: ReportedJobRepository,
        private jobRepository: JobRepository

    ) {}

    // async getAllReports(): Promise<any[]> {
    //     return await this.reportedJobRepository.findAll();
    // }

    async getAllReports(id?: string): Promise<any[]> { 
        let reports = await this.reportedJobRepository.findAll();
    
        // If id is provided, filter the reports
        if (id) {
            reports = reports.filter(report => report.jobId == id);
            reports = reports[0]
        }

        console.log(reports)
    
        return reports;
    }

    async updateReportStatus(reportId: string, status: string): Promise<any> {

        const report = await this.jobRepository.getJobId(reportId);
        if (!report) {
            throw new Error('Report not found');
        }

        return await this.jobRepository.updateJob(reportId, status)
    }

    async getReportDetails(reportId: string): Promise<any> {
        const report = await this.reportedJobRepository.getReportById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }
        return report;
    }
}