import { ObjectId } from "mongodb";

export interface Task {
  _id: ObjectId;
  title: string;
  dateCreated: number;
  inProgress: boolean;
  completed: boolean;
}
