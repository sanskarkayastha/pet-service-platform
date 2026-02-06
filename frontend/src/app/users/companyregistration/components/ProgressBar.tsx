import styles from "./progressBar.module.css";
import { Check } from "lucide-react";

const steps = ["Business Details", "Documents", "Images", "Location"];

const ProgressBar = ({ currentStep = 4 }) => {
  return (
    <div className={styles.progressWrapper}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const completed = stepNumber < currentStep;
        const active = stepNumber === currentStep;

        return (
          <div key={step} className={styles.step}>
            <div
              className={`${styles.circle} ${
                completed ? styles.completed : ""
              } ${active ? styles.active : ""}`}
            >
              {completed ? <Check size={16} /> : stepNumber}
            </div>

            <span
              className={`${styles.label} ${active ? styles.labelActive : ""}`}
            >
              {step}
            </span>

            {index !== steps.length - 1 && (
              <div
                className={`${styles.line} ${
                  completed ? styles.lineCompleted : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
