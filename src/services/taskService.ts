import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { Task } from "../types/task";

// Create a new task
export async function createTask(
  taskData: Omit<Task, "id">,
  attachmentFiles?: File[]
): Promise<string> {
  try {
    // Handle file uploads
    const attachments = [];

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

    // Create task document
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

// Get tasks by user and status
export async function getTasksByStatus(
  userId: string,
  status: string
): Promise<Task[]> {
  try {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(tasksQuery);
    const tasks: Task[] = [];

    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });

    return tasks;
  } catch (error) {
    console.error(`Error fetching ${status} tasks:`, error);
    throw error;
  }
}

// Update a task
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

// Delete a task
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
