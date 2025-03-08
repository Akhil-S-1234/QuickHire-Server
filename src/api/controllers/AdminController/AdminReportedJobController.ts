import { HttpStatus } from '../../../utils/HttpStatus';
import { createResponse } from '../../../utils/CustomResponse';
import { RequestHandler, Request, Response } from 'express';
import { ReportedJobUseCase } from '../../../application/use-cases/Admin/ReportedJobUseCase';

export class AdminReportedJobController {
    constructor(
        private reportedJobUseCase: ReportedJobUseCase
    ) { }

    getAllReports: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            // Extract pagination and filter parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            const status = req.query.status as string || 'all';
            const reportType = req.query.reportType as string || 'all';

            const paginationOptions = {
                page,
                limit,
                search,
                status,
                reportType
            };

            let reports;

            // Fetch all reports
            reports = await this.reportedJobUseCase.getAllReports(paginationOptions);


            res.status(HttpStatus.OK).json(
                createResponse('success', 'Reports retrieved successfully', reports)
            );
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                createResponse('error', 'Failed to fetch reports', error.message)
            );
        }
    }

    updateReportStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            console.log(id,)

            if (!id) {
                res.status(HttpStatus.BAD_REQUEST).json(
                    createResponse('error', 'Missing required fields', null)
                );
                return;
            }

            const updatedReport = await this.reportedJobUseCase.updateReportStatus(id, isActive);
            res.status(HttpStatus.OK).json(
                createResponse('success', 'Report status updated successfully', updatedReport)
            );
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                createResponse('error', 'Failed to update report status', error.message)
            );
        }
    }

    getReportDetails: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { reportId } = req.params;

            if (!reportId) {
                res.status(HttpStatus.BAD_REQUEST).json(
                    createResponse('error', 'Report ID is required', null)
                );
                return;
            }

            const report = await this.reportedJobUseCase.getReportDetails(reportId);
            res.status(HttpStatus.OK).json(
                createResponse('success', 'Report details retrieved successfully', report)
            );
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                createResponse('error', 'Failed to fetch report details', error.message)
            );
        }
    }
}