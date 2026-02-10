import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const isIOS = process.env.EXPO_OS === 'ios';

type SFIconProps = {
  sf: string;
  fallback: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
};

export function SFIcon({ sf, fallback, color, size = 20 }: SFIconProps) {
  if (isIOS) {
    return (
      <Image
        source={`sf:${sf}`}
        style={{ width: size, height: size, tintColor: color }}
        contentFit="contain"
      />
    );
  }

  return <FontAwesome name={fallback} size={size} color={color} />;
}
