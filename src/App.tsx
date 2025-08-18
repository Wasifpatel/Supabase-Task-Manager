import "./App.css"
import { useState, useEffect } from "react"; 
import TaskManager from "./components/Task_manager";
import Auth from "./components/Auth";
import { supabase } from "./supabase-client";

const App = () => {
  const [session, setsession] = useState<any>(null);

  const fetchSession = async ()=>{
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setsession(currentSession.data.session)
  };

  useEffect(() => {
    fetchSession();

    const {data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session)=>{
        setsession(session);
      }
    );

    return ()=>{
      authListener.subscription.unsubscribe();
    }
  }, [])

  const logout = async ()=>{
    await supabase.auth.signOut();
  }
  
  return (
    <>
      {session ? (
        <>
          <button onClick={logout}>Log out</button>
          <TaskManager session={session}/>
        </>
      ) : ( <Auth/>)}
    </>   
  )
}

export default App