import styles from "@/styles/features/HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.root}>
      <div>
        <h1>Wired Table Hub</h1>
        <h2>Board games with your friends, online</h2>
      </div>
      <p>
        Make an avatar, add friends and open a table in a couple of clicks.
        <br />
        We keep track of the rules and the score, you keep track of the
        bluffing.
      </p>
    </section>
  );
}
