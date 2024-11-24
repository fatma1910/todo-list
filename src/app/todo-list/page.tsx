"use client"

import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CreateTask from './_components/CreateTask';
import { db } from '../../../utils/dpConfig';
import { desc, eq } from 'drizzle-orm';
import { Task } from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { TaskProps } from '../../../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const page = () => {
  const [taskList, setTaskList] = useState<TaskProps[]>([]);
  const { user } = useUser();
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = async (taskId: number, currentChecked: boolean) => {
    try {
      await db
        .update(Task)
        .set({ checked: !currentChecked })
        .where(eq(Task.id, taskId));
      getAllTasks();

    } catch (error) {
      console.error("Error updating task:", error);
    }
  };


  useEffect(() => {
    user && getAllTasks();
  }, [user]);

  const getAllTasks = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      return;
    }

    try {
      const result = await db
        .select({
          id: Task.id,
          title: Task.title,
          createdBy: Task.createdBy,
          checked: Task.checked,
        })
        .from(Task)
        .where(eq(Task.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(Task.id));
      setTaskList(result);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const deleteTask = async (task: TaskProps) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
      buttonsStyling: false,
    });

    const result = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const deletionResult = await db
          .delete(Task)
          .where(eq(Task.id, task.id))
          .returning();

        if (deletionResult) {
          getAllTasks();
        }

        swalWithBootstrapButtons.fire(
          "Deleted!",
          "Your task has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire(
        "Cancelled",
        "Your task is safe :)",
        "error"
      );
    }
  };

  return (
    <div className="mt-32 mb-10 flex flex-col items-center justify-center gap-4 sm:px-0">
      <div className="flex items-center gap-2 flex-col sm:flex-row">
        <div className="p-2 bg-blue-400 rounded-md">
          <Check className="text-white font-semibold" size={34} strokeWidth={5} />
        </div>
        <h2 className="text-3xl sm:text-5xl text-blue-400">My To-do</h2>
      </div>
      <CreateTask isChecked={isChecked} refreshData={() => getAllTasks()} />
      {taskList?.length > 0
        ? taskList.map((task) => (
            <div key={task.id} className="w-full md:w-[750px] px-4 ">
              <div className="flex justify-between items-center py-2 px-1 rounded-md border-b bg-slate-50 shadow-sm">
                <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`task-${task.id}`}
                      className="w-6 h-6"
                      onClick={() => toggleCheck(task.id, task.checked)}
                      checked={task.checked}
                    />
                  

                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-xl sm:text-2xl ${
                      task.checked && "line-through"
                    } text-blue-950 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer`}
                  >
                    {task.title}
                  </label>
                </div>
                <div>
                  <Button
                    className="bg-red-600  hover:bg-red-500 px-5 py-4"
                    onClick={() => deleteTask(task)}
                  >
                    delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        : [1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className= " sm:w-[750px] px-4 w-full  bg-slate-200 rounded-lg h-10 animate-pulse"
            ></div>
          ))}
    </div>
  );
};

export default page;
