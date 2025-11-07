"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";


export type LoginError = {
  cred?: string;
  email?: string;
  password?: string;
}

export type FormState = {
  error: LoginError;
  prevData : {
    email: string;
    password: string;
  }
}


export async function logUserIn(prevState:FormState, formData:FormData) {
  let hasError:boolean = false;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: LoginError = {};

  if(email === ""){
      errors.email = "Email is required";
  }

  if(password === ""){
      errors.password = "Password is required";
  }

  if(Object.keys(errors).length > 0){
      return {error: errors, prevData: {email, password}};
  }

  // try {
  //   const response = await fetch("http://localhost:8080/api/users/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   });

  //   const result:string = await response.text();

  //   if (result !== "Login successful") {
  //     errors.cred = result;
  //     hasError = true;
  //   }
  // } catch (err) {
  //   errors.cred = "Server connection failed";
  //   hasError = true;
  // }

  try{
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
        callbackURL: '/'
      }
    })
  }catch(error){
    if( error instanceof APIError){
      hasError = true;
      errors.cred = error.message
    }
  }
  

  if(!hasError){
    redirect("/")
  }else{
    return {error: errors, prevData: {email, password}};
  }
}

export async function logUserInWithGoogle(){
  let hasError = false
  let gUrl = '';
  try{
    const {url} = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "/",
      }
    })
    if(!url){
      hasError = true
    }else{
      gUrl = url
    }
  }catch(error){
    if(error instanceof APIError){
      console.log(error.message)
    }
  }

  if(!hasError){
    redirect(gUrl)
  }
}
