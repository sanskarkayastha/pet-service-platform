import { auth } from "@/lib/auth";
import HeroSection from "../components/heroSection";
import ServicesSection from "../components/servicesSection";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export default async function  RootPage() {

  const session = await auth.api.getSession(
    {
      headers: await headers()
    }
  )
  if(session?.user.role === "admin"){
    redirect("/superAdmin")
  }

  redirect("/users")
}
