"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../utils/dpConfig';
import { Task } from '../../../../utils/schema';
import { AddTaskProps } from '../../../../types';
import { useUser } from '@clerk/nextjs';

const CreateTask = ({  refreshData , isChecked }:AddTaskProps) => {
    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const {user} = useUser();

    
    const addNewTask = async () => {
    
        setLoading(true);

    
        try {
          const result = await db
            .insert(Task)
            .values({
              title:title, 
              createdBy: user?.primaryEmailAddress?.emailAddress|| "", 
              checked:isChecked,
            })
            .returning({ insertedId: Task.id });
    

          
    
          if (result) {
            setTitle("");
            refreshData(); 
          }
        } catch (error) {
          console.error("Error adding new task:", error);

        } finally {
          setLoading(false); 
        }
      };
  return (
    <section className='max-w-[750px] mb-7 px-2 w-full '>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 w-full space-y-4 sm:space-y-0 ">
            <Input value={title} type="text" placeholder="What do you need to do today?"
            onChange={(e) => setTitle(e.target.value)}
            className='sm:w-[600px] py-4 sm:py-6  border-none border-x-2 border-b-2 border-gray-400 shadow-md' />
            <Button disabled={!(title)} type="submit" className='sm:w-36 w-full py-4 sm:py-6  bg-blue-400 hover:bg-blue-500 rounded-none shadow-md'
            onClick={() => addNewTask()}
            >Add</Button>
        </div>
    </section>
  )
}

export default CreateTask