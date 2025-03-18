import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import {
  getUserTasks,
  getTasksByStatus,
  createTask,
  updateTask,
  deleteTask,
  Task,
} from "../services/taskService";

export function useTasks() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      return getUserTasks(user.uid);
    },
    enabled: !!user?.uid,
  });

  const todoTasksQuery = useQuery({
    queryKey: ["tasks", user?.uid, "TODO"],
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
      // Invalidate all task queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<Task>;
    }) => {
      if (!user?.uid) throw new Error("User not authenticated");
      return updateTask(taskId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

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
    // Queries
    allTasks: tasksQuery.data || [],
    todoTasks: todoTasksQuery.data || [],
    inProgressTasks: inProgressTasksQuery.data || [],
    completedTasks: completedTasksQuery.data || [],
    isLoading:
      tasksQuery.isLoading ||
      todoTasksQuery.isLoading ||
      inProgressTasksQuery.isLoading ||
      completedTasksQuery.isLoading,
    isError:
      tasksQuery.isError ||
      todoTasksQuery.isError ||
      inProgressTasksQuery.isError ||
      completedTasksQuery.isError,
    error:
      tasksQuery.error ||
      todoTasksQuery.error ||
      inProgressTasksQuery.error ||
      completedTasksQuery.error,

    // Mutations
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    createError: createTaskMutation.error,
    updateError: updateTaskMutation.error,
    deleteError: deleteTaskMutation.error,
  };
}
