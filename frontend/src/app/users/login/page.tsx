import { auth } from "@/lib/auth";
import LoginForm from "./LoginForm"
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    );
    
    if(session){
        redirect("/");
    }else{
        return <LoginForm/>
    }
}
