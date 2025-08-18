import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../supabase-client";

const Auth = () => {
  const [isSignUp, setisSignUp] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    if (isSignUp) {
      const {error: signUpError} = await supabase.auth.signUp({email, password})
      if (signUpError) {
        console.error("Error in Signing up: ", signUpError.message);
        return;
      }
    }else{
      const {error: signInError} = await supabase.auth.signInWithPassword({email, password})
      if (signInError) {
        console.error("Error in Signing up: ", signInError.message);
        return
      }
    }
  };
  return (
    <div style={{maxWidth:"400px", margin: "0 auto", padding: "1rem"}}>
      <h2>{isSignUp? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>)=>
          setemail(e.target.value)
        }
        style={{width:"100%", marginBottom:"0.5rem", padding:"0.5rem"}}  
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>)=>{
          setpassword(e.target.value)
        }}
        style={{width:"100%", marginBottom:"0.5rem", padding:"0.5rem"}} 
        />
        <button
        type="submit"
        style={{padding:"0.5rem 1rem", marginRight:"0.5rem"}}
        >
          {isSignUp? "Sign Up" : "Sign In"}
        </button>
      </form>
      <button
      onClick={()=>{
        setisSignUp(!isSignUp)
      }}
      style={{padding:"0.5rem 1rem"}}
      >
        {isSignUp? "Switch to Sign In" : "Switch to Sign Up"}
      </button>
    </div>
  )
}

export default Auth;