import { ObjectId } from "mongodb";

export interface Task {
  _id: ObjectId;
  title: string;
  dateCreated: number;
  deadline?: Date | null;
  inProgress?: boolean;
  completed: boolean;
  userId: string;
}
