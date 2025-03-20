import { Task } from "../types/task";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: keyof Task | "";
  direction: SortDirection;
}

export const sortTasks = (tasks: Task[], sortConfig: SortConfig): Task[] => {
  if (!sortConfig.key) {
    return tasks;
  }

  return [...tasks].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "dueDate") {
      const aDate = aValue ? new Date(aValue as string) : new Date(0);
      const bDate = bValue ? new Date(bValue as string) : new Date(0);

      if (sortConfig.direction === "asc") {
        return aDate.getTime() - bDate.getTime();
      } else {
        return bDate.getTime() - aDate.getTime();
      }
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortConfig.direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};
