

export interface ReportedJobRepository {
    create(data: any): Promise<any>
    findByUserAndJob(userId: string, jobId: string): Promise<any>
    findAll(): Promise<any[]>
    updateStatus(reportId: string, status: string): Promise<any>
    getReportById(reportId: string): Promise<any>
}