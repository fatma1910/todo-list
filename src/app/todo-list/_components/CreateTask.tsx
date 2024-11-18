"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { db } from '../../../../utils/dpConfig';
import { Task } from '../../../../utils/schema';
import { AddTaskProps } from '../../../../types';
import { useUser } from '@clerk/nextjs';

const CreateTask = ({  refreshData }:AddTaskProps) => {
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
    <section className='max-w-[800px]'>
        <div className="flex items-center space-x-2 w-full">
            <Input type="text" placeholder="What do you need to do today?"
            onChange={(e) => setTitle(e.target.value)}
            className='w-[600px] py-6 border-none border-x-2 border-b-2 border-gray-400 shadow-md' />
            <Button disabled={!(title)} type="submit" className='w-36 py-6 bg-blue-400 hover:bg-blue-500 rounded-none shadow-md'
            onClick={() => addNewTask()}
            >Add</Button>
        </div>
    </section>
  )
}

export default CreateTask