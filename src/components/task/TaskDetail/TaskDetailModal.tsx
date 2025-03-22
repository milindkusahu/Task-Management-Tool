import React, { useState, useEffect } from "react";
import { Modal, Button, Badge, Divider } from "../../common";
import { Task } from "../../../types/task";
import { DateIcon } from "../../../utils/icons";
import { formatDate } from "../../../utils/dateUtils";
import { TaskForm } from "../TaskForm";

export interface ActivityLogItem {
  action: string;
  timestamp: string;
  previousValue?: string | null;
  newValue?: string | null;
}

export interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: {
    taskId: string;
    updates: Partial<Task>;
    attachmentFiles?: File[];
  }) => void;
  task: Task | null;
  activityLog?: ActivityLogItem[];
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

const isImageUrl = (url: string): boolean => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];
  const lowerCaseUrl = url.toLowerCase();

  // Check if the URL has a query string and extract the base URL
  const baseUrl = lowerCaseUrl.split("?")[0];

  return imageExtensions.some((ext) => baseUrl.endsWith(ext));
};

// Component to handle image loading with fallback
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center bg-gray-100 rounded">
        <p className="text-sm text-gray-500">Image cannot be displayed</p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs mt-1"
        >
          Open image in new tab
        </a>
      </div>
    );
  }

  return (
    <img src={imgSrc} alt={alt} className={className} onError={handleError} />
  );
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  task,
  activityLog = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [isOpen, task]);

  const handleTaskUpdate = (
    taskData: Omit<Task, "id" | "userId">,
    attachmentFiles: File[]
  ) => {
    if (!task) return;

    onUpdate({
      taskId: String(task.id),
      updates: taskData,
      attachmentFiles: attachmentFiles,
    });
    setIsEditing(false);
  };

  if (!isOpen || !task) return null;

  const modalFooter = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        CLOSE
      </Button>
      {!isEditing && <Button onClick={() => setIsEditing(true)}>EDIT</Button>}
    </div>
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN-PROGRESS":
        return "info";
      default:
        return "default";
    }
  };

  const getCategoryVariant = (category: string = "WORK") => {
    return category === "WORK" ? "work" : "personal";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "Task Details"}
      size="xl"
      footer={isEditing ? undefined : modalFooter}
    >
      {isEditing ? (
        <TaskForm
          task={task}
          onSubmit={handleTaskUpdate}
          onCancel={() => setIsEditing(false)}
          includeAttachments={true}
        />
      ) : (
        <div className="flex md:flex-row flex-col h-full max-h-[80vh]">
          {/* Main content area */}
          <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">{task.title}</h2>

            {task.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-800 whitespace-pre-line">
                  {task.description}
                </p>
              </div>
            )}

            <Divider className="my-4" />

            {/* Task metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Category
                </h3>
                <Badge variant={getCategoryVariant(task.category)}>
                  {task.category || "Work"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </h3>
                <div className="flex items-center gap-2">
                  <DateIcon className="w-4 h-4 text-gray-500" />
                  <span>{task.dueDate || "Not set"}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Status
                </h3>
                <Badge variant={getStatusVariant(task.status)}>
                  {task.status}
                </Badge>
              </div>
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Attachments ({task.attachments.length})
                </h3>
                <div className="space-y-4">
                  {task.attachments.map((attachment, index) => {
                    const isImage = isImageUrl(attachment.url);

                    return (
                      <div
                        key={index}
                        className="border rounded-md overflow-hidden"
                      >
                        {isImage ? (
                          <div className="flex flex-col">
                            <div className="p-2 border-b bg-gray-50 flex justify-between items-center">
                              <span className="text-sm font-medium truncate">
                                {attachment.name}
                              </span>
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs ml-2"
                              >
                                Open
                              </a>
                            </div>
                            <div className="p-3 bg-gray-50 flex justify-center">
                              <ImageWithFallback
                                src={attachment.url}
                                alt={attachment.name}
                                className="max-w-full max-h-64 object-contain rounded"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 hover:bg-gray-50">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-blue-600 truncate flex-1">
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {attachment.name}
                              </a>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Activity sidebar */}
          <div className="w-full md:w-72 border-t md:border-l md:border-t-0 border-gray-200 bg-gray-50 p-4 overflow-auto">
            <h3 className="font-medium text-gray-700 mb-4">Activity</h3>

            {activityLog.length > 0 ? (
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between text-gray-500 mb-1">
                      <span>You {activity.action}</span>
                      <span>{formatDate(activity.timestamp)}</span>
                    </div>
                    {activity.previousValue && activity.newValue && (
                      <div className="mt-1 text-xs">
                        <span className="bg-red-100 px-1 py-0.5 rounded">
                          {activity.previousValue}
                        </span>
                        {" → "}
                        <span className="bg-green-100 px-1 py-0.5 rounded">
                          {activity.newValue}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No activity recorded yet.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailModal;
