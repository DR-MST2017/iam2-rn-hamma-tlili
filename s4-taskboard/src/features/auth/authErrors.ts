import { FirebaseError } from 'firebase/app';

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou mot de passe incorrect.',
  'auth/invalid-email': 'Adresse e-mail invalide.',
  'auth/missing-password': 'Saisissez un mot de passe.',
  'auth/email-already-in-use': 'Un compte existe déjà avec cette adresse.',
  'auth/weak-password': 'Mot de passe trop faible : 6 caractères au minimum.',
  'auth/operation-not-allowed': 'La connexion par e-mail et mot de passe n\'est pas activée dans la console Firebase.',
  'auth/too-many-requests': 'Trop de tentatives. Patientez une minute puis réessayez.',
  'auth/network-request-failed': 'Réseau indisponible. Vérifiez la connexion du téléphone.',
};

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return MESSAGES[error.code] ?? `Erreur Firebase : ${error.code}`;
  }
  return 'Erreur inattendue. Réessayez.';
}