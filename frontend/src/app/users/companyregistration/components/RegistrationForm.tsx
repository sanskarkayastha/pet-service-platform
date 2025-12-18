// 'use client';

// import React, { useState } from 'react';
// import { CheckCircle } from 'lucide-react';
// import StepOne from '../components/StepOne';
// import StepTwo from '../components/StepTwo';
// import styles from '../components/Registration.module.css';

// type RegistrationFormProps = {
//   id: string; // 👈 Accept the id here
// };

// const RegistrationForm = ({ id }: RegistrationFormProps) => {
//   const [currentStep, setCurrentStep] = useState(1);

//   const [formData, setFormData] = useState({
//     businessName: '',
//     ownerName: '',
//     email: '',
//     contactNumber: '',
//     businessAddress: '',
//     serviceType: 'Veterinary ',
//     businessDescription: '',
//     panNumber: '',
//     businessLogo: null,
//     license: null,
//     verificationDoc: null,
//     confirmAuthenticity: false,
//     agreeTerms: false,
//     userId: id,   // OPTIONAL: saves the session user id automatically
//   });

//   const handleNext = () => setCurrentStep(2);
//   const handleBack = () => setCurrentStep(1);
//   const handleSubmit = () => alert(`Registration submitted by user: ${id}`);
//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.logo}>
//           <div className={styles.logoIcon}></div>
//           Furrever
//         </div>
//         <h1 className={styles.title}>Business Registration</h1>
//         <p className={styles.subtitle}>Join our network of trusted pet service providers</p>
//       </div>

//       <div className={styles.card}>
//         <div className={styles.stepper}>
//           <div
//             className={`${styles.stepperLine} ${
//               currentStep === 2 ? styles.stepperLineActive : ''
//             }`}
//           ></div>

//           <div className={styles.stepItem}>
//             <div
//               className={`${styles.stepCircle} ${
//                 currentStep >= 1 ? styles.stepCircleActive : ''
//               }`}
//             >
//               {currentStep > 1 ? <CheckCircle size={20} /> : '1'}
//             </div>
//             <span
//               className={`${styles.stepLabel} ${
//                 currentStep === 1 ? styles.stepLabelActive : ''
//               }`}
//             >
//               Business Details
//             </span>
//           </div>

//           <div className={styles.stepItem}>
//             <div
//               className={`${styles.stepCircle} ${
//                 currentStep === 2 ? styles.stepCircleActive : ''
//               }`}
//             >
//               2
//             </div>
//             <span
//               className={`${styles.stepLabel} ${
//                 currentStep === 2 ? styles.stepLabelActive : ''
//               }`}
//             >
//               Documents
//             </span>
//           </div>
//         </div>

//         {currentStep === 1 && (
//           <StepOne 
//             formData={formData} 
//             setFormData={setFormData} 
//             onNext={handleNext}
//           />
//         )}
//         {currentStep === 2 && (
//           <StepTwo 
//             formData={formData} 
//             setFormData={setFormData}
//             onBack={handleBack}
//             onSubmit={handleSubmit}
//           />
//         )}
//       </div>

//       <p className={styles.footer}>
//         Your information is encrypted and secure. We respect your privacy.
//       </p>
//     </div>
//   );
// };

// export default RegistrationForm;


'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import styles from '../components/Registration.module.css';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const RegistrationForm = () => {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: '', 
    businessName: '',
    ownerName: '',
    email: '',
    contactNumber: '',
    businessAddress: '',
    serviceType: '',
    businessDescription: '',
    panNumber: '',
    businessLogo: null,
    license: null,
    verificationDoc: null,
    confirmAuthenticity: false,
    agreeTerms: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authClient.getSession();
        if (!data) {
          router.push("/login");
        } else {
          setFormData(
            (prev)=>({
              ...prev,
              userId: data?.data?.user.id || ''
            })
          )
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const [currentStep, setCurrentStep] = useState(1);
  
  const handleNext = () => setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);

  if (loading) return <div className={styles.container}>Loading session...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          Pet Service Network
        </div>
        <h1 className={styles.title}>Business Registration</h1>
        <p className={styles.subtitle}>Join our network of trusted pet service providers</p>
      </div>

      <div className={styles.card}>
        
        <div className={styles.stepper}>
        </div>

        {currentStep === 1 && (
          <StepOne 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <StepTwo 
            formData={formData} 
            setFormData={setFormData}
            onBack={handleBack}
            onSubmit={() => console.log("Final Data:", formData)} 
          />
        )}
      </div>

      <p className={styles.footer}>
        Your information is encrypted and secure. We respect your privacy.
      </p>
    </div>
  );
};

export default RegistrationForm;