import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import {
  getTasksByStatus,
  createTask,
  updateTask,
  updateTaskWithAttachments,
  deleteTask,
} from "../services/taskService";
import { Task } from "../types/task";

export function useTasks() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // Query tasks by status
  const todoTasksQuery = useQuery({
    queryKey: ["tasks", user?.uid, "TO-DO"],
    queryFn: async () => {
      if (!user?.uid) return [];
      return getTasksByStatus(user.uid, "TO-DO");
    },
    enabled: !!user?.uid,
  });

  const inProgressTasksQuery = useQuery({
    queryKey: ["tasks", user?.uid, "IN-PROGRESS"],
    queryFn: async () => {
      if (!user?.uid) return [];
      return getTasksByStatus(user.uid, "IN-PROGRESS");
    },
    enabled: !!user?.uid,
  });

  const completedTasksQuery = useQuery({
    queryKey: ["tasks", user?.uid, "COMPLETED"],
    queryFn: async () => {
      if (!user?.uid) return [];
      return getTasksByStatus(user.uid, "COMPLETED");
    },
    enabled: !!user?.uid,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: {
      taskData: Omit<Task, "id" | "userId">;
      attachmentFiles?: File[];
    }) => {
      if (!user?.uid) throw new Error("User not authenticated");

      const taskWithUser = {
        ...data.taskData,
        userId: user.uid,
      };

      return createTask(taskWithUser, data.attachmentFiles);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      updates,
      attachmentFiles,
    }: {
      taskId: string;
      updates: Partial<Task>;
      attachmentFiles?: File[];
    }) => {
      if (!user?.uid) throw new Error("User not authenticated");

      // If we have new attachment files, use the special update function
      if (attachmentFiles && attachmentFiles.length > 0) {
        return updateTaskWithAttachments(taskId, updates, attachmentFiles);
      }

      // Otherwise use the regular update function
      return updateTask(taskId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    todoTasks: todoTasksQuery.data || [],
    inProgressTasks: inProgressTasksQuery.data || [],
    completedTasks: completedTasksQuery.data || [],
    isLoading:
      todoTasksQuery.isLoading ||
      inProgressTasksQuery.isLoading ||
      completedTasksQuery.isLoading,

    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}
