"use client";
import { useState } from "react";
import SignupForm from "./SignupForm";
import Navbar from "@/app/components/navbar";

export default function Signup() {
  return(
    <>
      <Navbar />
      <SignupForm />

    </>
  );
}
