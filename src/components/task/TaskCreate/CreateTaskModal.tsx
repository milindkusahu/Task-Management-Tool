import React from "react";
import { Modal } from "../../common";
import { TaskForm } from "../TaskForm";
import { Task } from "../../../types/task";

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    taskData: Omit<Task, "id" | "userId">,
    attachmentFiles: File[]
  ) => void;
  initialStatus?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStatus = "TO-DO",
}) => {
  const handleSubmit = (
    taskData: Omit<Task, "id" | "userId">,
    attachmentFiles: File[]
  ) => {
    onSave(taskData, attachmentFiles);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task" size="lg">
      <TaskForm
        initialStatus={initialStatus}
        onSubmit={handleSubmit}
        onCancel={onClose}
        includeAttachments={true}
      />
    </Modal>
  );
};

export default CreateTaskModal;
