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
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase/config";
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
    // Simplified query without ordering until indexes are built
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      where("status", "==", status)
    );

    const querySnapshot = await getDocs(tasksQuery);
    const tasks: Task[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Format date fields properly
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

    // Sort in-memory instead of in the query
    return tasks.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error(`Error fetching ${status} tasks:`, error);
    return []; // Return empty array instead of throwing to prevent UI errors
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

    // Get the task document first to check permissions
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("Task not found");
    }

    const taskData = taskDoc.data();
    const currentUser = auth.currentUser;

    // Verify that the task belongs to the current user
    if (!currentUser || taskData.userId !== currentUser.uid) {
      console.error("Permission denied: Task doesn't belong to current user");
      throw new Error("Permission denied: Task doesn't belong to current user");
    }

    // If we get here, the task belongs to the current user
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
