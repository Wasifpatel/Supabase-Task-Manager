import { useState, useEffect } from 'react';
import type { ChangeEvent } from "react";
import { supabase } from '../supabase-client';
import type { Session } from '@supabase/supabase-js';

interface Task{
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
}

const Task_manager = ({session}: {session: Session}) => {
  const [newTask, setnewTask] = useState({title:"",description:""});
  const [tasks, setTasks] = useState<Task[]>([])
  const [newDescription, setnewDescription] = useState("")

  const [taskImage, setTaskImage] = useState<File|null>(null)

  // Read Information
  const fetchTasks = async()=>{
    const {error, data} = await supabase
    .from("Tasks")
    .select("*")
    .order("created_at", {ascending:true})

    if (error) {
      console.error("Error reading task" ,error.message);
      return;
    }
    setTasks(data)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [])
  
  useEffect(() => {
    const channel = supabase.channel("tasks-channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Tasks" },
        (payload) => {
          const newTask = payload.new as Task;
          setTasks((prev) => [...prev, newTask]);
        }
      )
      .subscribe((status) => {
        console.log("Subscription: ", status);
      });
      return () => {
    channel.unsubscribe();
  };
  }, []);

  console.log(tasks);

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("tasks-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    const { data } = await supabase.storage
      .from("tasks-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Create Insertion
  const handleSubmit = async(e: any)=>{
    e.preventDefault();

    let imageUrl: string | null = null;
    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
    }

    const {error} = await supabase
    .from("Tasks")
    .insert({...newTask, email: session.user.email, image_url: imageUrl})
    .select()
    .single();
    if (error) {
      console.error("Error adding task" ,error.message);
      return;
    }
    setnewTask({title:"",description:""});
  };

  // Delete Information
  const deleteTask = async(id: number)=>{
    const {error} = await supabase.from("Tasks").delete().eq("id", id)

    if (error) {
      console.error("Error deleting task" ,error.message);
      return;
    }
  };

  //update Information
  const updateTask = async(id: number)=>{
    const {error} = await supabase.from("Tasks").update({description: newDescription}).eq("id", id)

    if (error) {
      console.error("Error Updating task" ,error.message);
      return;
    }
  };

  return (
    <div>
      <h2>Task Manager CRUD</h2>

      <form onSubmit={handleSubmit} style={{marginBottom: "1rem"}}>
        <input
        type='text'
        placeholder='Task Title'
        onChange={(e)=> 
          setnewTask((prev)=>({...prev, title: e.target.value }))}
        style={{width:"100%", marginBottom:"0.5rem", padding:"0.5rem"}}
        />
        <textarea
        placeholder='Task Description'
        onChange={(e)=> 
          setnewTask((prev)=>({...prev, description: e.target.value }))}
        style={{width:"100%", marginBottom:"0.5rem", padding:"0.5rem"}}
        />

        <input type='file' accept='image/*' onChange={handleFileChange} />
        <button type='submit' style={{padding:"0.5rem 1rem"}}>
          Add Task
        </button>
      </form>

      <ul style={{listStyle:"none", padding: 0}}>
        {tasks.map((task,key)=>(
        <li 
        key={key}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "1 rem",
          marginBottom: "0.5rem",
        }}>
          <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <img src={task.image_url} style={{height:"70px"}}></img>
            <br></br>
            <textarea placeholder='Updated description' 
            style={{padding: "0.5rem 1rem" , marginRight:"0.5rem"}}
            onChange={(e)=>setnewDescription(e.target.value)}
            ></textarea>
            <button style={{padding: "0.5rem 1rem" , marginRight:"0.5rem"}}
            onClick={()=>updateTask(task.id) }
            >Edit </button>
            <button onClick={() => deleteTask(task.id)} style={{padding: "0.5rem 1rem"}}>Delete </button>
          </div>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default Task_manager