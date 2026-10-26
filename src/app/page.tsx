import AuthSection from "@/features/authentication/AuthSection";
import HeroSection from "@/features/hero/HeroSection";
import styles from "@/styles/HomePage.module.css";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <Suspense>
        <AuthSection />
      </Suspense>
    </main>
  );
}
