import apiClient from "@/lib/api-client";

export async function registerBusiness(formData: any) {
  try {
    const multipart = new FormData();

    // Build the businessInfo payload expected by the backend BusinessDTO
    const businessInfo = {
      userId: formData.userId,
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      // Always prefer the address coming from the Leaflet map (Step 4)
      businessAddress:
        formData.location?.address || formData.businessAddress || "",
      description: formData.businessDescription,
      city: formData.city || "",
      panNumber: formData.panNumber,
      category: formData.serviceType,
      latitude: formData.location?.lat ?? null,
      longitude: formData.location?.lng ?? null,
    };

    multipart.append(
      "businessInfo",
      new Blob([JSON.stringify(businessInfo)], {
        type: "application/json",
      }),
    );

    // Attach required files with names matching @RequestPart in BusinessController
    if (formData.businessLogo?.file) {
      multipart.append("logo-upload", formData.businessLogo.file);
    }
    if (formData.license?.file) {
      multipart.append("license-upload", formData.license.file);
    }
    if (formData.verificationDoc?.file) {
      multipart.append("verification-upload", formData.verificationDoc.file);
    }

    // Use authenticated API utility - automatically adds JWT token
    return await apiClient.post("/api/business/addBusiness", multipart);
  } catch (error) {
    console.error("Error registering business", error);
    throw error;
  }
}