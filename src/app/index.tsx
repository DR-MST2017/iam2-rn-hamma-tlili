import { StyleSheet, Text, View } from 'react-native';

// Replace with your own first name and last name.
const STUDENT_NAME: string = 'Prénom Nom';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>w0-hello</Text>
      <Text style={styles.text}>{STUDENT_NAME}</Text>
      <Text style={styles.text}>IAM2 - React Native avec Expo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
  },
  title: { fontSize: 28, fontWeight: '700', color: '#1f2430' },
  text: { fontSize: 16, color: '#374151' },
});
