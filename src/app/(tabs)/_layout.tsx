import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar, // style object
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size }) => <MaterialCommunityIcons name="view-dashboard-outline" size={size} color="white" />,
        }}
      />

      <Tabs.Screen
        name="batches"
        options={{
          tabBarIcon: ({ size }) => <MaterialCommunityIcons name="food-steak" size={size} color="white" />,
        }}
      />

      <Tabs.Screen
        name="qrCode"
        options={{
          tabBarButton: () => (
            <View style={styles.qrContainer}>
              <TouchableOpacity style={styles.qrButton} onPress={() => router.push('/qrCode')}>
                <MaterialCommunityIcons name="qrcode-scan" size={28} color="white" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="shipments"
        options={{
          tabBarIcon: ({ size }) => <MaterialCommunityIcons name="truck-delivery-outline" size={size} color="white" />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size }) => <MaterialCommunityIcons name="account-outline" size={size} color="white" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'relative',
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#FF4D6D',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  qrContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4D6D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
});
