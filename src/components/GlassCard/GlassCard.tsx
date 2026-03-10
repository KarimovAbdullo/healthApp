import { BlurView } from 'expo-blur';
import { StyleProp, ViewStyle } from 'react-native';
import { Platform, View } from 'react-native';

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

export function GlassCard({ children, style, intensity = 40 }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} tint="dark" style={[glassStyle, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[glassStyle, { backgroundColor: 'rgba(255,255,255,0.08)' }, style]}>
      {children}
    </View>
  );
}

const glassStyle: ViewStyle = {
  borderRadius: 16,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.12)',
};
