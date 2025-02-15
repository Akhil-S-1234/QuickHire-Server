// // src/infrastructure/services/cronJobs/deleteSuspendedRecruiters.ts
// import cron from "node-cron";
// import { MongoRecruiterRepository } from "../../repositories/MongoRecruiterRepository";

// // Run every 24 hours
// cron.schedule("0 0 * * *", async () => {
//   console.log("Running job to delete suspended recruiters...");

//   const twoDaysAgo = new Date();
//   twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

//   const recruitersToDelete = await RecruiterRepository.findSuspendedBefore(twoDaysAgo);

//   for (const recruiter of recruitersToDelete) {
//     await RecruiterRepository.delete(recruiter.id);
//     console.log(`Deleted recruiter with ID: ${recruiter.id}`);
//   }

//   console.log("Job completed.");
// });
