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
import { Task } from "../types/task";

export async function createTask(
  taskData: Omit<Task, "id">,
  attachmentFiles?: File[]
): Promise<string> {
  try {
    const attachments = taskData.attachments || [];

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

    const taskRef = await addDoc(collection(db, "tasks"), {
      ...taskData,
      attachments,
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
    // First get the existing task to get any current attachments
    const taskRef = doc(db, "tasks", taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data();

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

    // Update the task with all attachments
    await updateDoc(taskRef, {
      ...updates,
      attachments,
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
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
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

    // Note: In a production app, you might want to also delete the attachment files
    // from Firebase Storage when a task is deleted to avoid orphaned files

    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export type { Task };
