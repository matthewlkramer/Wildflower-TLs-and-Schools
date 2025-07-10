import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TestTube } from 'lucide-react';

interface TestModeContextType {
  isTestMode: boolean;
  setTestMode: (enabled: boolean) => void;
}

// Create a global test mode context
let testModeState = {
  isTestMode: false,
  listeners: new Set<(enabled: boolean) => void>()
};

export const useTestMode = (): TestModeContextType => {
  const [isTestMode, setIsTestMode] = useState(testModeState.isTestMode);

  const setTestMode = (enabled: boolean) => {
    testModeState.isTestMode = enabled;
    testModeState.listeners.forEach(listener => listener(enabled));
    setIsTestMode(enabled);
  };

  // Subscribe to test mode changes
  useState(() => {
    const listener = (enabled: boolean) => setIsTestMode(enabled);
    testModeState.listeners.add(listener);
    return () => testModeState.listeners.delete(listener);
  });

  return { isTestMode, setTestMode };
};

export const getTestMode = () => testModeState.isTestMode;

export function TestModeToggle() {
  const { isTestMode, setTestMode } = useTestMode();

  return (
    <div className="flex items-center space-x-3 p-3 bg-slate-50 border-b border-slate-200">
      <TestTube className={`h-4 w-4 ${isTestMode ? 'text-orange-600' : 'text-slate-400'}`} />
      <div className="flex items-center space-x-2">
        <Switch
          id="test-mode"
          checked={isTestMode}
          onCheckedChange={setTestMode}
        />
        <Label htmlFor="test-mode" className="text-sm font-medium">
          Test Mode
        </Label>
      </div>
      {isTestMode && (
        <Alert className="ml-4 py-1 px-2 bg-orange-50 border-orange-200">
          <AlertDescription className="text-xs text-orange-700">
            Testing enabled - no real data will be modified
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}