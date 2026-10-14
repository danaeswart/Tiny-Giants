import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase.js';

/** { user, ready }: the signed-in parent (null if signed out), and whether Firebase has finished checking. */
export function useAuth() {
  const [state, setState] = useState({ user: auth.currentUser, ready: false });

  useEffect(() => onAuthStateChanged(auth, (user) => setState({ user, ready: true })), []);

  return state;
}
