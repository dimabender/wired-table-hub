export const COPY = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to pick up where you left off",
    submit: "Log in",
    switchText: "Don't have an account?",
    switchLink: "Sign up",
    switchHref: "?mode=signup",
  },
  signup: {
    title: "Create account",
    subtitle: "It takes under a minute, then you're in",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchHref: "?mode=login",
  },
} as const;

export type AuthMode = keyof typeof COPY;
