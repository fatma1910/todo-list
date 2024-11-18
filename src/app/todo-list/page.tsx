"use client"
import { Check } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CreateTask from './_components/CreateTask'
import { db } from '../../../utils/dpConfig'
import { desc, getTableColumns ,eq } from 'drizzle-orm'
import { Task } from '../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import { TaskProps } from '../../../types'
import { Checkbox } from '@/components/ui/checkbox'

const page = () => {
    const [taskList,setTaskList]=useState<TaskProps[]>([]);
    const {user}=useUser();
    
    useEffect(()=>{
        user&&getAllTasks();
      },[user])

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

            })
            .from(Task)
            .where(eq(Task.createdBy, user.primaryEmailAddress.emailAddress))
            .orderBy(desc(Task.id));
      
          
          setTaskList(result);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      

  return (
    <div className='mt-32 mb-10 flex flex-col items-center justify-center gap-4  '>
        <div className='flex items-center gap-2'>
            <div className='p-2 bg-blue-400 rounded-md '>
                <Check className='text-white font-semibold ' size={48} strokeWidth={5} />
            </div>
            
            <h2 className='text-5xl text-blue-400'>My To-do</h2>
        </div>
        <CreateTask  refreshData={()=>getAllTasks()} />
        {taskList?.length>0? taskList.map((task)=>(
          <div key={task.id} > 
          <div>
            <div className="flex items-center space-x-2">
                <Checkbox id={`task-${task.id}`} />
                <label
                    htmlFor={`task-${task.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {task.title}
                </label>
            </div>

          </div>
          </div>
        ))
      :[1,2,3,4,5].map((item,index)=>(
        <div key={index} className='w-[750px] bg-slate-200 rounded-lg
        h-10 animate-pulse'>

        </div>
      ))
      }
        
    </div>
  )
}

export default page


