import { useState } from 'react';
import { ActivityScreen } from '@/components/onboarding/ActivityScreen';
import { AiIntroScreen } from '@/components/onboarding/AiIntroScreen';
import { AuthScreen } from '@/components/AuthScreen';
import { BrowserWindow } from '@/components/browser/BrowserWindow';
import { SplashScreen } from '@/components/SplashScreen';
import { writeStoredProfile, type ActivityId } from '@/lib/profile';

type Stage = 'splash' | 'activity' | 'ai' | 'auth' | 'browser';

export default function App() {
  const [stage, setStage] = useState<Stage>('splash');

  if (stage === 'splash') return <SplashScreen onContinue={() => setStage('activity')} />;
  if (stage === 'activity')
    return (
      <ActivityScreen
        onContinue={(activity: ActivityId) => {
          writeStoredProfile({ activity });
          setStage('ai');
        }}
      />
    );
  if (stage === 'ai') return <AiIntroScreen onContinue={() => setStage('auth')} />;
  if (stage === 'auth') return <AuthScreen onDone={() => setStage('browser')} />;
  return <BrowserWindow />;
}
