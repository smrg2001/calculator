import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import MyKeyboard from './src/components/MyKeyboard'; // Assuming MyKeyboard is a custom component
import React from 'react';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MyKeyboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
});
