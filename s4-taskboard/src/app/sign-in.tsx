import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/features/auth/AuthContext';
import { authErrorMessage } from '@/features/auth/authErrors';

export default function SignInScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (action: (email: string, password: string) => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action(email.trim(), password);
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="prenom.nom@exemple.tn"
        placeholderTextColor="#94a3b8"
      />
      <Text style={styles.label}>Mot de passe (6 caractères minimum)</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Mot de passe"
        placeholderTextColor="#94a3b8"
      />
      {error !== null && <Text style={styles.error}>{error}</Text>}
      {busy ? (
        <ActivityIndicator style={styles.spinner} />
      ) : (
        <View style={styles.actions}>
          <Pressable style={styles.primary} onPress={() => submit(signIn)}>
            <Text style={styles.primaryText}>Se connecter</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => submit(signUp)}>
            <Text style={styles.secondaryText}>Créer un compte</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8, backgroundColor: '#ffffff' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#0f172a',
  },
  error: { color: '#b91c1c', fontSize: 14, marginTop: 8 },
  spinner: { marginTop: 24 },
  actions: { gap: 12, marginTop: 24 },
  primary: { backgroundColor: '#1f2430', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  secondary: { borderWidth: 1, borderColor: '#1f2430', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: '#1f2430', fontSize: 16, fontWeight: '600' },
});