import { useRouter } from 'expo-router';

import { InfoScreen } from '@/features/info/info-screen';

export default function InfoRoute() {
  const router = useRouter();

  return <InfoScreen onBack={() => router.back()} />;
}
