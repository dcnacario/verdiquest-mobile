import React, { createContext } from "react";
import axios from "axios";

// Create the context
export const TaskContext = createContext();

// Provider Component
export const TaskProvider = ({ children }) => {
  const submitTask = async (taskData) => {
    try {
      const response = await axios.post(
        "http://yourserverip:3000/addTask",
        taskData
      );

      if (response.data.success) {
        console.log("Task added!", response.data);
        // Handle success (maybe clear form or show a success message)
      }
    } catch (error) {
      console.error("Error adding task:", error);
      // Handle error (show error message)
    }
  };

  return (
    <TaskContext.Provider value={{ submitTask }}>
      {children}
    </TaskContext.Provider>
  );
};
