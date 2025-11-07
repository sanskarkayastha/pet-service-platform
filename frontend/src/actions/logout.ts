"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function logOut(){
    const result = await auth.api.signOut({
        headers: await headers(),
    })
    if(result.success){
        return true
    }
}