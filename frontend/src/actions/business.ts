export async function registerBusiness(formData:any){   
    try {
        const response = await fetch('http://localhost:8080/api/business/addBusiness',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
        })
        const result = await response.text()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
    
}