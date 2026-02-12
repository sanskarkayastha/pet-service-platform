"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type RegisterError = {
    name?: string;
    email?: string;
    password?: string;
    general?: string;
}

export type FormState = {
    errors: RegisterError;
    prevData: {
        name: string;
        email: string;
        password: string;
    }
}

export async function registerUser(prevState:FormState, formData: FormData){
    let hasError:boolean = false;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors:RegisterError = {};

    if(name === ""){
        errors.name = "Name is required";
    }

    if(email === ""){
        errors.email = "Email is required";
    }

    if(password === "" || password.length < 8){
        errors.password = "Password must be at least 8 characters";
    }

    if(Object.keys(errors).length > 0){
        return {
            errors: errors,
            prevData: {name, email, password}
        }
        
    }else{
        // try{
        //     const response = await fetch("http://localhost:8080/api/users/register", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             name: name,
        //             email: email,
        //             password: password
        //         }),
        //     });
        //     const result = await response.text();

        //     if(result !== "User registered successfully"){
        //         hasError = true;
        //         errors.general = "Registration failed. Please try again.";
        //     }


        // }catch(err){
        //     errors.general = "Registration failed. Please try again.";
        // }
        const response = await auth.api.signUpEmail(
            {
                body:{
                    name: name,
                    email: email,
                    password: password,
                    callbackURL:
                        process.env.NEXT_PUBLIC_APP_URL?.concat("/users/login") ??
                        "/users/login",
                },
                asResponse: true
            }
        )
        if(!response.ok){
            hasError = true;
            const data = await response.json();
            errors.general = data.message;
        }
        
    }

    if(!hasError){
        redirect(`/users/verify-email?email=${encodeURIComponent(email)}`);
    }else{
        return {
            errors: errors,
            prevData: {name, email, password}
        }
    }

}