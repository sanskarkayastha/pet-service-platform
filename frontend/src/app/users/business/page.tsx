import RegistrationForm from '../business/components/RegistrationForm';

export default function BusinessPage() {

  async function registerBusiness(formData:any) {
    'use server';
    console.log("here")
    try {
      const response = await fetch('http://localhost:8080/api/business/addBusiness',{
        method: 'POST',
        body: JSON.stringify(formData)
      })
      const result = await response.text()
      console.log(result)
    } catch (error) {
      console.log(error)
    }
    
  }
  
  return (
    <div>
      <RegistrationForm onsubmit={registerBusiness}/>
    </div>
  );
}