import { ObjectId } from "mongodb";

export interface User {
  userId: ObjectId;
  email: string;
  password: string;
}
