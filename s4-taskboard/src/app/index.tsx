import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/features/auth/AuthContext';

export default function BoardScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.account}>
        <Text style={styles.email}>Connecté : {user?.email}</Text>
        <Pressable onPress={signOut}>
          <Text style={styles.link}>Se déconnecter</Text>
        </Pressable>
      </View>
      <Text style={styles.text}>Le tableau des tâches arrive à l'étape 3.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
  },
  email: { flex: 1, fontSize: 14, color: '#334155' },
  link: { fontSize: 14, fontWeight: '600', color: '#b91c1c' },
  text: { fontSize: 16, color: '#475569', textAlign: 'center', marginTop: 24, paddingHorizontal: 24 },
});