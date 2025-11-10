import { auth } from '@/lib/auth';
import RegistrationForm from '../business/components/RegistrationForm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BusinessPage() {
  const session = await auth.api.getSession(
    {
      headers: await headers()
    }
  )

  if(!session){
    redirect("/")
  }else{
    const id:string = session.user.id
    return (
      <div>
        <RegistrationForm id={id}/>
      </div>
    ); 
  }

  
}