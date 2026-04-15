import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export class EmailNotVerifiedError extends Error {
  constructor() {
    super('Please verify your email before signing in.')
    this.name = 'EmailNotVerifiedError'
  }
}

export async function signUp(email: string, password: string): Promise<void> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(credential.user)
  await signOut(auth)
}

export async function signIn(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  if (!credential.user.emailVerified) {
    await signOut(auth)
    throw new EmailNotVerifiedError()
  }
}

export async function resendVerification(email: string, password: string): Promise<void> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  try {
    await sendEmailVerification(credential.user)
  } finally {
    await signOut(auth)
  }
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

export async function logOut(): Promise<void> {
  await signOut(auth)
}

export async function signInWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}
