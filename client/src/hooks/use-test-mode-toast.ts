/**
 * Helper hook that displays contextual toasts when the application is in test
 * mode. Provides functions to show success or warning messages instead of
 * executing real operations.
 */
import { useToast } from '@/hooks/use-toast';
import { getTestMode } from '@/components/TestModeToggle';

export function useTestModeToast() {
  const { toast } = useToast();

  const showTestModeSuccess = (action: string, entityType: string) => {
    if (getTestMode()) {
      toast({
        title: "Test Mode Active",
        description: `${action} ${entityType} simulated successfully. No real data was modified.`,
        duration: 3000,
        className: "bg-orange-50 border-orange-200 text-orange-700"
      });
      return true;
    }
    return false;
  };

  const showTestModeWarning = (action: string) => {
    if (getTestMode()) {
      toast({
        title: "Test Mode Active",
        description: `${action} operation will be simulated only.`,
        duration: 2000,
        className: "bg-orange-50 border-orange-200 text-orange-700"
      });
      return true;
    }
    return false;
  };

  return { showTestModeSuccess, showTestModeWarning };
}