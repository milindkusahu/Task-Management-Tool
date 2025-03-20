import { useState, useEffect } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Task } from "../../types/task";
import { formatDate } from "../../utils/dateUtils";
import {
  Header,
  TaskList,
  TaskBoard,
  TaskDetailModal,
  CreateTaskModal,
  TaskFilters,
  TaskViewToggle,
  NoResults,
} from "../../components";
import { TaskFilterValues } from "../../components/task/TaskFilters";
import { TaskColumn } from "../../components/task/TaskBoard";

const Dashboard = () => {
  const { data: userProfile } = useCurrentUser();
  const {
    todoTasks,
    inProgressTasks,
    completedTasks,
    isLoading: isLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [view, setView] = useState<"list" | "board">("list");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [filters, setFilters] = useState<TaskFilterValues>({
    category: "",
    dueDate: "",
    searchText: "",
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.preferences?.defaultView) {
      setView(userProfile.preferences.defaultView as "list" | "board");
    }
  }, [userProfile]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleAddTaskClick = () => {
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleTaskUpdate = async ({
    taskId,
    updates,
  }: {
    taskId: string;
    updates: Partial<Task>;
  }) => {
    try {
      await updateTask({ taskId, updates });
      if (isTaskDetailModalOpen) {
        setIsTaskDetailModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const transformTasks = (tasks: Task[]) => {
    return tasks.map((task) => ({
      ...task,
      dueDate:
        typeof task.dueDate === "string"
          ? task.dueDate
          : formatDate(task.dueDate),
    }));
  };

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      if (filters.category && task.category !== filters.category) {
        return false;
      }

      if (filters.dueDate && task.dueDate !== filters.dueDate) {
        return false;
      }

      if (
        filters.searchText &&
        !task.title.toLowerCase().includes(filters.searchText.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredTodoTasks = filterTasks(transformTasks(todoTasks));
  const filteredInProgressTasks = filterTasks(transformTasks(inProgressTasks));
  const filteredCompletedTasks = filterTasks(transformTasks(completedTasks));

  const taskSections = [
    {
      id: "todo",
      title: `Todo (${filteredTodoTasks.length})`,
      color: "bg-[#FAC3FF]",
      tasks: filteredTodoTasks,
    },
    {
      id: "inProgress",
      title: `In-Progress (${filteredInProgressTasks.length})`,
      color: "bg-[#85D9F1]",
      tasks: filteredInProgressTasks,
    },
    {
      id: "completed",
      title: `Completed (${filteredCompletedTasks.length})`,
      color: "bg-[#CDFFCC]",
      tasks: filteredCompletedTasks,
    },
  ];

  const boardColumns: TaskColumn[] = [
    {
      id: "todo",
      title: `Todo (${filteredTodoTasks.length})`,
      color: "bg-[#FAC3FF]",
      status: "TO-DO",
      tasks: filteredTodoTasks,
    },
    {
      id: "inProgress",
      title: `In-Progress (${filteredInProgressTasks.length})`,
      color: "bg-[#85D9F1]",
      status: "IN-PROGRESS",
      tasks: filteredInProgressTasks,
    },
    {
      id: "completed",
      title: `Completed (${filteredCompletedTasks.length})`,
      color: "bg-[#CDFFCC]",
      status: "COMPLETED",
      tasks: filteredCompletedTasks,
    },
  ];

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask({ id: String(task.id), status: task.status });
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: task.id, status: task.status })
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();

    if (!draggedTask) return;

    const { id, status } = draggedTask;

    if (status === targetStatus) return;

    updateTask({
      taskId: id,
      updates: { status: targetStatus },
    });

    setDraggedTask(null);
  };

  const handleCreateTask = async (taskData: Omit<Task, "id" | "userId">) => {
    try {
      await createTask({
        taskData,
        attachmentFiles: [],
      });
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleFilterChange = (newFilters: TaskFilterValues) => {
    setFilters(newFilters);
  };

  const handleViewChange = (newView: "list" | "board") => {
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header showAddTaskButton onAddTaskClick={handleAddTaskClick} />

      {/* Main content */}
      <div className="max-w-[1402px] mx-auto px-4 md:px-8 py-6">
        {/* View toggle and filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <TaskViewToggle view={view} onChange={handleViewChange} />
            <TaskFilters
              onFilterChange={handleFilterChange}
              initialValues={filters}
            />
          </div>
        </div>

        {/* Table headers for list view */}
        {view === "list" &&
          !isLoadingTasks &&
          filteredTodoTasks.length +
            filteredInProgressTasks.length +
            filteredCompletedTasks.length >
            0 && (
            <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-2 text-sm font-medium text-gray-600 mb-2">
              <div>Task name</div>
              <div>Due on</div>
              <div>Task Status</div>
              <div>Task Category</div>
            </div>
          )}

        {/* Task Views */}
        {isLoadingTasks ? (
          <div className="py-12 text-center">Loading tasks...</div>
        ) : filteredTodoTasks.length === 0 &&
          filteredInProgressTasks.length === 0 &&
          filteredCompletedTasks.length === 0 &&
          filters.searchText ? (
          <NoResults
            message="It looks like we can't find any results that match."
            imageSrc="/not-found.png"
          />
        ) : view === "list" ? (
          <div className="space-y-4">
            {taskSections.map((section) => (
              <TaskList
                key={section.id}
                title={section.title}
                color={section.color}
                tasks={section.tasks}
                defaultOpen
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    section.id === "todo"
                      ? "TO-DO"
                      : section.id === "inProgress"
                      ? "IN-PROGRESS"
                      : "COMPLETED"
                  )
                }
                onDragStart={handleDragStart}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={deleteTask}
                onTaskClick={handleEditTask}
                onAddTaskClick={() => setIsTaskModalOpen(true)}
              />
            ))}
          </div>
        ) : (
          <TaskBoard
            columns={boardColumns}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={deleteTask}
            onTaskClick={handleEditTask}
            onTaskCreate={() => setIsTaskModalOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleCreateTask}
      />

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => setIsTaskDetailModalOpen(false)}
        onUpdate={handleTaskUpdate}
        task={selectedTask}
        activityLog={[
          {
            action: "created this task",
            timestamp: new Date().toISOString(),
            previousValue: null,
            newValue: null,
          },
          {
            action: "changed status from to-do to in-progress",
            timestamp: new Date().toISOString(),
            previousValue: "TO-DO",
            newValue: "IN-PROGRESS",
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
