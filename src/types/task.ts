import { FirestoreTimestamp } from "./user";

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
  category: string;
  dueDate: string;
  userId: string;
  tags?: string[];
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  createdAt?: Date | FirestoreTimestamp;
  updatedAt?: Date | FirestoreTimestamp;
}

export interface CreateTaskFormData {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  tags?: string[];
  attachments?: File[];
}
