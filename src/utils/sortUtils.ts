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
    // Use type guard to ensure key is valid before accessing
    if (sortConfig.key === "") {
      return 0;
    }

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

    if (sortConfig.key === "tags") {
      const aTags = (aValue as string[]) || [];
      const bTags = (bValue as string[]) || [];

      if (aTags.length !== bTags.length) {
        if (sortConfig.direction === "asc") {
          return aTags.length - bTags.length;
        } else {
          return bTags.length - aTags.length;
        }
      }

      if (aTags.length > 0 && bTags.length > 0) {
        const aFirstTag = aTags[0].toLowerCase();
        const bFirstTag = bTags[0].toLowerCase();

        if (sortConfig.direction === "asc") {
          return aFirstTag.localeCompare(bFirstTag);
        } else {
          return bFirstTag.localeCompare(aFirstTag);
        }
      }

      if (aTags.length > 0) return sortConfig.direction === "asc" ? -1 : 1;
      if (bTags.length > 0) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortConfig.direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }

    // Handle nullish values
    const aSafe = aValue ?? "";
    const bSafe = bValue ?? "";

    if (aSafe < bSafe) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aSafe > bSafe) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};
