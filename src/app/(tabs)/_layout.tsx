import { Tabs } from 'expo-router';
import { CirclePlus, Compass, Dumbbell, Trophy, UserRound } from 'lucide-react-native';

import { Palette, Radius } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.oxblood,
        tabBarInactiveTintColor: Palette.faint,
        tabBarStyle: {
          minHeight: 78,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: Palette.black,
          borderTopWidth: 0,
          borderTopLeftRadius: Radius.lg,
          borderTopRightRadius: Radius.lg,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dojo"
        options={{
          title: 'Mon Dojo',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Créer',
          tabBarIcon: ({ color, size }) => <CirclePlus color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Rang',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
