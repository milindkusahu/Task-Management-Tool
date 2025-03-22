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
  activityLog?: ActivityLogItem[];
}

export interface ActivityLogItem {
  action: string;
  timestamp: Date | FirestoreTimestamp;
  previousValue?: string | null;
  newValue?: string | null;
  field?: string;
  userId?: string;
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
