import { ReportedJobModel } from '../database/models/ReportedJobModel';
import { ReportedJobRepository } from '../../domain/repositories/ReportedJobRepository';
import { Types } from 'mongoose';


export class MongoReportedJobRepository implements ReportedJobRepository {

  async create(data: { userId: string; jobId: string; reportType: string; description: string; reportedAt: Date }): Promise<any> {
    try {
      // Convert userId and jobId to MongoDB ObjectId
      const report = new ReportedJobModel({
        userId: new Types.ObjectId(data.userId),
        jobId: new Types.ObjectId(data.jobId),
        reportType: data.reportType,
        description: data.description,
        reportedAt: data.reportedAt,
      });

      // Save the report in the database
      await report.save();
      return report;
    } catch (error: any) {
      throw new Error(`Failed to create reported job: ${error.message}`);
    }
  }

  async findByUserAndJob(userId: string, jobId: string): Promise<any | null> {
    try {
      return await ReportedJobModel.findOne({
        userId: new Types.ObjectId(userId),
        jobId: new Types.ObjectId(jobId),
      });
    } catch (error: any) {
      throw new Error(`Failed to find reported job: ${error.message}`);
    }
  }

  
  async findAll(): Promise<any[]> {
    // try {
    //   return await ReportedJobModel.find({})
    //     .sort({ createdAt: -1 });
    // } catch (error: any) {
    //   throw new Error(`Failed to fetch reported jobs: ${error.message}`);
    // }
    try {
      const aggregatedReports = await ReportedJobModel.aggregate([
        // Sort by creation date descending
        { $sort: { createdAt: -1 } },
        
        // Group by jobId
        {
          $group: {
            _id: '$jobId',
            jobId: { $first: '$jobId' },
            reports: {
              $push: {
                reportType: '$reportType',
                description: '$description',
                status: '$status',
                userId: '$userId',
                createdAt: '$createdAt'
              }
            },
            totalReports: { $sum: 1 }
          }
        },
        
        // Convert jobId string to ObjectId for lookup
        {
          $addFields: {
            jobIdObj: { $toObjectId: '$jobId' }
          }
        },
  
        // Lookup job details
        {
          $lookup: {
            from: 'jobs', // Replace with your actual jobs collection name
            localField: 'jobIdObj',
            foreignField: '_id',
            as: 'jobDetails'
          }
        },
        
        // Unwind the jobDetails array
        {
          $unwind: {
            path: '$jobDetails',
            preserveNullAndEmptyArrays: true
          }
        },
  
        // Process reports array to convert userIds to ObjectIds
        {
          $addFields: {
            reports: {
              $map: {
                input: '$reports',
                as: 'report',
                in: {
                  $mergeObjects: [
                    '$$report',
                    {
                      userIdObj: { $toObjectId: '$$report.userId' }
                    }
                  ]
                }
              }
            }
          }
        },
  
        // Lookup user details
        {
          $lookup: {
            from: 'users', // Replace with your actual users collection name
            let: { reportUserIds: '$reports.userIdObj' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$_id', '$$reportUserIds']
                  }
                }
              }
            ],
            as: 'userDetails'
          }
        },
  
        // Map the reports array to include user details
        {
          $addFields: {
            reports: {
              $map: {
                input: '$reports',
                as: 'report',
                in: {
                  $mergeObjects: [
                    {
                      reportType: '$$report.reportType',
                      description: '$$report.description',
                      status: '$$report.status',
                      createdAt: '$$report.createdAt'
                    },
                    {
                      userDetails: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$userDetails',
                              cond: { 
                                $eq: ['$$this._id', '$$report.userIdObj']
                              }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
  
        // Clean up temporary fields
        {
          $project: {
            _id: 1,
            jobId: 1,
            jobDetails: 1,
            reports: 1,
            totalReports: 1
          }
        },
        
        // Sort by total reports descending
        { $sort: { totalReports: -1 } }
      ]);
  
      return aggregatedReports;
    } catch (error: any) {
      throw new Error(`Failed to fetch reported jobs: ${error.message}`);
    }
  }

  async updateStatus(reportId: string, status: string): Promise<any> {
    try {
      const report = await ReportedJobModel.findByIdAndUpdate(
        new Types.ObjectId(reportId),
        { status },
        { new: true }
      );
      if (!report) {
        throw new Error('Report not found');
      }
      return report;
    } catch (error: any) {
      throw new Error(`Failed to update report status: ${error.message}`);
    }
  }

  async getReportById(reportId: string): Promise<any> {
    try {
      const report = await ReportedJobModel.findById(new Types.ObjectId(reportId));
      if (!report) {
        throw new Error('Report not found');
      }
      return report;
    } catch (error: any) {
      throw new Error(`Failed to fetch report: ${error.message}`);
    }
  }
  
}