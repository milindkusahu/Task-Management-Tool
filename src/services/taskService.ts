import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase/config";
import { Task, ActivityLogItem } from "../types/task";

export async function createTask(
  taskData: Omit<Task, "id">,
  attachmentFiles?: File[]
): Promise<string> {
  try {
    const attachments = taskData.attachments || [];
    const currentUser = auth.currentUser;

    if (attachmentFiles && attachmentFiles.length > 0) {
      for (const file of attachmentFiles) {
        const storageRef = ref(
          storage,
          `task-attachments/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        attachments.push({ name: file.name, url });
      }
    }

    // Create initial activity log
    const initialActivity: ActivityLogItem = {
      action: "created this task",
      timestamp: new Date(),
      userId: currentUser?.uid,
    };

    const taskRef = await addDoc(collection(db, "tasks"), {
      ...taskData,
      attachments,
      activityLog: [initialActivity],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return taskRef.id;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function getTasksByStatus(
  userId: string,
  status: string
): Promise<Task[]> {
  try {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      where("status", "==", status)
    );

    const querySnapshot = await getDocs(tasksQuery);
    const tasks: Task[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const formattedData = {
        ...data,
        id: doc.id,
        createdAt: data.createdAt
          ? new Date(data.createdAt.seconds * 1000)
          : new Date(),
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt.seconds * 1000)
          : new Date(),
        dueDate:
          typeof data.dueDate === "string"
            ? data.dueDate
            : data.dueDate && "seconds" in data.dueDate
            ? new Date(data.dueDate.seconds * 1000).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
      };

      tasks.push(formattedData as Task);
    });

    return tasks.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error(`Error fetching ${status} tasks:`, error);
    return [];
  }
}

export async function updateTaskWithAttachments(
  taskId: string,
  updates: Partial<Task>,
  attachmentFiles: File[]
): Promise<void> {
  try {
    // First get the existing task to get any current attachments and activity log
    const taskRef = doc(db, "tasks", taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data() as Task;
    const currentUser = auth.currentUser;

    // Start with existing attachments if they're in the updates,
    // or from the current task if not
    const attachments = updates.attachments || taskData.attachments || [];

    // Upload new attachment files
    for (const file of attachmentFiles) {
      const storageRef = ref(
        storage,
        `task-attachments/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      attachments.push({ name: file.name, url });
    }

    // Create activity logs
    const newActivities: ActivityLogItem[] = [];
    const timestamp = new Date();

    // Check each update field and create activity logs (same as in updateTask)
    if (updates.status && updates.status !== taskData.status) {
      newActivities.push({
        action: `changed status`,
        timestamp,
        previousValue: taskData.status,
        newValue: updates.status,
        field: "status",
        userId: currentUser?.uid,
      });
    }

    if (updates.title && updates.title !== taskData.title) {
      newActivities.push({
        action: `updated title`,
        timestamp,
        previousValue: taskData.title,
        newValue: updates.title,
        field: "title",
        userId: currentUser?.uid,
      });
    }

    if (updates.description && updates.description !== taskData.description) {
      newActivities.push({
        action: `updated description`,
        timestamp,
        field: "description",
        userId: currentUser?.uid,
      });
    }

    if (updates.dueDate && updates.dueDate !== taskData.dueDate) {
      newActivities.push({
        action: `changed due date`,
        timestamp,
        previousValue: taskData.dueDate,
        newValue: updates.dueDate,
        field: "dueDate",
        userId: currentUser?.uid,
      });
    }

    if (updates.category && updates.category !== taskData.category) {
      newActivities.push({
        action: `changed category`,
        timestamp,
        previousValue: taskData.category,
        newValue: updates.category,
        field: "category",
        userId: currentUser?.uid,
      });
    }

    // Add activity for new attachments
    if (attachmentFiles.length > 0) {
      newActivities.push({
        action: `added ${attachmentFiles.length} attachment${
          attachmentFiles.length > 1 ? "s" : ""
        }`,
        timestamp,
        field: "attachments",
        userId: currentUser?.uid,
      });
    }

    // Update the task with all attachments and activity logs
    const existingActivities = taskData.activityLog || [];
    await updateDoc(taskRef, {
      ...updates,
      attachments,
      activityLog: [...existingActivities, ...newActivities],
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating task with attachments:", error);
    throw error;
  }
}

export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  try {
    const taskRef = doc(db, "tasks", taskId);

    // First, get the current task data
    const taskDoc = await getDoc(taskRef);
    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data() as Task;
    const currentUser = auth.currentUser;

    // Create new activity log entries based on what changed
    const newActivities: ActivityLogItem[] = [];
    const timestamp = new Date();

    // Check each update field and create activity logs
    if (updates.status && updates.status !== taskData.status) {
      newActivities.push({
        action: `changed status`,
        timestamp,
        previousValue: taskData.status,
        newValue: updates.status,
        field: "status",
        userId: currentUser?.uid,
      });
    }

    if (updates.title && updates.title !== taskData.title) {
      newActivities.push({
        action: `updated title`,
        timestamp,
        previousValue: taskData.title,
        newValue: updates.title,
        field: "title",
        userId: currentUser?.uid,
      });
    }

    if (updates.description && updates.description !== taskData.description) {
      newActivities.push({
        action: `updated description`,
        timestamp,
        field: "description",
        userId: currentUser?.uid,
      });
    }

    if (updates.dueDate && updates.dueDate !== taskData.dueDate) {
      newActivities.push({
        action: `changed due date`,
        timestamp,
        previousValue: taskData.dueDate,
        newValue: updates.dueDate,
        field: "dueDate",
        userId: currentUser?.uid,
      });
    }

    if (updates.category && updates.category !== taskData.category) {
      newActivities.push({
        action: `changed category`,
        timestamp,
        previousValue: taskData.category,
        newValue: updates.category,
        field: "category",
        userId: currentUser?.uid,
      });
    }

    // Handle changes to attachments by detecting added or removed items
    if (updates.attachments) {
      // We'll just log that attachments were updated for simplicity
      if (
        !taskData.attachments ||
        taskData.attachments.length !== updates.attachments.length
      ) {
        newActivities.push({
          action: `updated attachments`,
          timestamp,
          field: "attachments",
          userId: currentUser?.uid,
        });
      }
    }

    // Update the task with new activities added to existing ones
    const existingActivities = taskData.activityLog || [];
    const updatedData = {
      ...updates,
      activityLog: [...existingActivities, ...newActivities],
      updatedAt: serverTimestamp(),
    };

    await updateDoc(taskRef, updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    const taskRef = doc(db, "tasks", taskId);

    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data();
    const currentUser = auth.currentUser;

    if (!currentUser || taskData.userId !== currentUser.uid) {
      console.error("Permission denied: Task doesn't belong to current user");
      throw new Error("Permission denied: Task doesn't belong to current user");
    }

    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export type { Task, ActivityLogItem };
