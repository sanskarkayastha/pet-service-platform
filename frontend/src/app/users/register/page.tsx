import { auth } from "@/lib/auth";
import SignupForm from "./SignupForm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";


export default async function Signup() {
  const session = await auth.api.getSession(
          {
              headers: await headers(),
          }
      );
      
      if(session){
          redirect("/");
      }else{
          return <SignupForm/>
      }
}
