import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  style?: object;
  color?: string;
}

export default function Icon({ name, size = 40, style, color = colors.text }: IconProps) {
  try {
    return (
      <View style={[styles.iconContainer, style]}>
        <Ionicons name={name} size={size} color={color} />
      </View>
    );
  } catch (error) {
    console.error('❌ Error rendering Icon:', error, { name, size, color });
    // Fallback to a simple view if icon fails to render
    return (
      <View style={[styles.iconContainer, style, { width: size, height: size, backgroundColor: color + '20' }]} />
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
