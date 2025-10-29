"use server";

import { redirect } from "next/navigation";

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

    if(password === ""){
        errors.password = "Password is required";
    }

    if(Object.keys(errors).length > 0){
        
    }else{
        try{
            const response = await fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                }),
            });
            const result = await response.text();

            if(result !== "User registered successfully"){
                hasError = true;
                errors.general = "Registration failed. Please try again.";
            }


        }catch(err){
            errors.general = "Registration failed. Please try again.";
        }
    }

    if(!hasError){
        redirect("/users/login");
    }else{
        return {
            errors: errors,
            prevData: {name, email, password}
        }
    }

}