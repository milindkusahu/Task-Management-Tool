import { useState, useEffect } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Task } from "../../types/task";
import { formatDate } from "../../utils/dateUtils";
import { sortTasks, SortConfig } from "../../utils/sortUtils";
import {
  Header,
  TaskList,
  TaskBoard,
  TaskDetailModal,
  CreateTaskModal,
  TaskFilters,
  TaskViewToggle,
  NoResults,
  SortIndicator,
  BatchActions,
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
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });
  const [filters, setFilters] = useState<TaskFilterValues>({
    category: "",
    startDate: "",
    endDate: "",
    searchText: "",
    tags: [],
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);

  useEffect(() => {
    if (userProfile?.preferences?.defaultView) {
      setView(userProfile.preferences.defaultView as "list" | "board");
    }
  }, [userProfile]);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleAddTaskClick = () => {
    setIsTaskModalOpen(true);
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

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(taskId)) {
        newSelection.delete(taskId);
      } else {
        newSelection.add(taskId);
      }
      return newSelection;
    });
  };

  const selectAllTasks = (tasks: Task[]) => {
    setSelectedTaskIds((prev) => {
      const newSelection = new Set(prev);
      tasks.forEach((task) => {
        if (task.id) {
          newSelection.add(task.id.toString());
        }
      });
      return newSelection;
    });
  };

  const clearTaskSelection = () => {
    setSelectedTaskIds(new Set());
  };

  const handleBatchDelete = async () => {
    if (selectedTaskIds.size === 0) return;

    const confirmation = window.confirm(
      `Are you sure you want to delete ${selectedTaskIds.size} selected tasks?`
    );
    if (!confirmation) return;

    try {
      // Process deletions one by one
      const promises = Array.from(selectedTaskIds).map((id) => deleteTask(id));
      await Promise.all(promises);

      // Clear selection after successful deletion
      clearTaskSelection();
    } catch (error) {
      console.error("Error performing batch delete:", error);
      alert("Some tasks could not be deleted. Please try again.");
    }
  };

  const handleBatchComplete = async () => {
    if (selectedTaskIds.size === 0) return;

    try {
      // Mark all selected tasks as completed
      const promises = Array.from(selectedTaskIds).map((id) =>
        updateTask({
          taskId: id,
          updates: { status: "COMPLETED" },
        })
      );
      await Promise.all(promises);

      // Clear selection after successful update
      clearTaskSelection();
    } catch (error) {
      console.error("Error marking tasks as completed:", error);
      alert("Some tasks could not be updated. Please try again.");
    }
  };

  const toggleMultiSelect = () => {
    setIsMultiSelectActive(!isMultiSelectActive);
    if (isMultiSelectActive) {
      // Clear selection when turning off multi-select
      clearTaskSelection();
    }
  };

  const handleSort = (key: keyof Task) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key,
          direction: "asc",
        };
      }
    });
  };

  const handleFilterChange = (newFilters: TaskFilterValues) => {
    setFilters(newFilters);
  };

  const handleViewChange = (newView: "list" | "board") => {
    setView(newView);
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

      if (filters.startDate || filters.endDate) {
        const taskDate = task.dueDate ? new Date(task.dueDate) : null;

        if (taskDate) {
          // Set hours to 0 for date comparison only
          taskDate.setHours(0, 0, 0, 0);

          if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (taskDate < startDate) return false;
          }

          if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(0, 0, 0, 0);
            if (taskDate > endDate) return false;
          }
        } else if (filters.startDate || filters.endDate) {
          return false;
        }
      }

      // Filter by tags
      if (filters.tags.length > 0 && task.tags) {
        const hasMatchingTag = filters.tags.some(
          (tag) => task.tags && task.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      // Filter by search text
      if (
        filters.searchText &&
        !task.title.toLowerCase().includes(filters.searchText.toLowerCase()) &&
        !(
          task.description &&
          task.description
            .toLowerCase()
            .includes(filters.searchText.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredTodoTasks = filterTasks(transformTasks(todoTasks));
  const filteredInProgressTasks = filterTasks(transformTasks(inProgressTasks));
  const filteredCompletedTasks = filterTasks(transformTasks(completedTasks));

  const sortedTodoTasks = sortConfig.key
    ? sortTasks(filteredTodoTasks, sortConfig)
    : filteredTodoTasks;
  const sortedInProgressTasks = sortConfig.key
    ? sortTasks(filteredInProgressTasks, sortConfig)
    : filteredInProgressTasks;
  const sortedCompletedTasks = sortConfig.key
    ? sortTasks(filteredCompletedTasks, sortConfig)
    : filteredCompletedTasks;

  const taskSections = [
    {
      id: "todo",
      title: `Todo (${sortedTodoTasks.length})`,
      color: "bg-[#FAC3FF]",
      tasks: sortedTodoTasks,
    },
    {
      id: "inProgress",
      title: `In-Progress (${sortedInProgressTasks.length})`,
      color: "bg-[#85D9F1]",
      tasks: sortedInProgressTasks,
    },
    {
      id: "completed",
      title: `Completed (${sortedCompletedTasks.length})`,
      color: "bg-[#CDFFCC]",
      tasks: sortedCompletedTasks,
    },
  ];

  const boardColumns: TaskColumn[] = [
    {
      id: "todo",
      title: `Todo (${sortedTodoTasks.length})`,
      color: "bg-[#FAC3FF]",
      status: "TO-DO",
      tasks: sortedTodoTasks,
    },
    {
      id: "inProgress",
      title: `In-Progress (${sortedInProgressTasks.length})`,
      color: "bg-[#85D9F1]",
      status: "IN-PROGRESS",
      tasks: sortedInProgressTasks,
    },
    {
      id: "completed",
      title: `Completed (${sortedCompletedTasks.length})`,
      color: "bg-[#CDFFCC]",
      status: "COMPLETED",
      tasks: sortedCompletedTasks,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        showAddTaskButton={true}
        onAddTaskClick={() => setIsTaskModalOpen(true)}
      />

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

          {/* Batch Actions */}
          <BatchActions
            selectedCount={selectedTaskIds.size}
            onBatchDelete={handleBatchDelete}
            onBatchComplete={handleBatchComplete}
            onToggleMultiSelect={toggleMultiSelect}
            isMultiSelectActive={isMultiSelectActive}
            onSelectAll={() => {
              const allTasks = [
                ...sortedTodoTasks,
                ...sortedInProgressTasks,
                ...sortedCompletedTasks,
              ];
              selectAllTasks(allTasks);
            }}
            onClearSelection={clearTaskSelection}
          />
        </div>

        {/* Table headers for list view */}
        {view === "list" &&
          !isLoadingTasks &&
          sortedTodoTasks.length +
            sortedInProgressTasks.length +
            sortedCompletedTasks.length >
            0 && (
            <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 text-sm font-medium text-gray-600 mb-2">
              <div>Task name</div>
              <div className="flex items-center gap-1">
                Due on
                <SortIndicator
                  direction={
                    sortConfig.key === "dueDate" ? sortConfig.direction : null
                  }
                  onClick={() => handleSort("dueDate")}
                  className="ml-1"
                />
              </div>
              <div className="flex items-center gap-1">
                Task Status
                <SortIndicator
                  direction={
                    sortConfig.key === "status" ? sortConfig.direction : null
                  }
                  onClick={() => handleSort("status")}
                  className="ml-1"
                />
              </div>
              <div className="flex items-center gap-1">
                Task Category
                <SortIndicator
                  direction={
                    sortConfig.key === "category" ? sortConfig.direction : null
                  }
                  onClick={() => handleSort("category")}
                  className="ml-1"
                />
              </div>
              <div className="flex items-center gap-1">
                Tags
                <SortIndicator
                  direction={
                    sortConfig.key === "tags" ? sortConfig.direction : null
                  }
                  onClick={() => handleSort("tags")}
                  className="ml-1"
                />
              </div>
            </div>
          )}

        {/* Task Views */}
        {isLoadingTasks ? (
          <div className="py-12 text-center">Loading tasks...</div>
        ) : sortedTodoTasks.length === 0 &&
          sortedInProgressTasks.length === 0 &&
          sortedCompletedTasks.length === 0 &&
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
                isMultiSelectActive={isMultiSelectActive}
                selectedTaskIds={selectedTaskIds}
                onToggleTaskSelection={toggleTaskSelection}
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
            isMultiSelectActive={isMultiSelectActive}
            selectedTaskIds={selectedTaskIds}
            onToggleTaskSelection={toggleTaskSelection}
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
