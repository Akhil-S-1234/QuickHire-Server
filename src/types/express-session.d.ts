import "express-session";

declare module "express-session" {
    interface SessionData {
      user?: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        password: string;
      };
      recruiter?: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        mobile: string;
        currentLocation: string;
        currentCompany: string;
        currentDesignation: string;
        fromDate: string;
        toDate: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        profilePicture: string;
      };
    }
  }