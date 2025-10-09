import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'info' | 'warning' | 'danger';
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
}: ConfirmDialogProps) {
  const getColor = () => {
    switch (variant) {
      case 'danger': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#0ea5e9';
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      {title && (
        <DialogTitle sx={{ fontWeight: 600, fontSize: 18, pb: 1 }}>
          {title}
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: title ? 2 : 3, pb: 2 }}>
        <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
          {message}
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined" size="small">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="small"
          sx={{
            bgcolor: getColor(),
            '&:hover': { bgcolor: getColor(), opacity: 0.9 },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Alert dialog (single button)
interface AlertDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export function AlertDialog({
  open,
  title,
  message,
  confirmText = 'OK',
  onConfirm,
  variant = 'info',
}: AlertDialogProps) {
  const getColor = () => {
    switch (variant) {
      case 'success': return '#10b981';
      case 'error': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#0ea5e9';
    }
  };

  return (
    <Dialog open={open} onClose={onConfirm} maxWidth="sm" fullWidth>
      {title && (
        <DialogTitle sx={{ fontWeight: 600, fontSize: 18, pb: 1 }}>
          {title}
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: title ? 2 : 3, pb: 2 }}>
        <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
          {message}
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="small"
          sx={{
            bgcolor: getColor(),
            '&:hover': { bgcolor: getColor(), opacity: 0.9 },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Hook for imperative usage
interface DialogState {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'info' | 'warning' | 'danger' | 'success' | 'error';
  type: 'confirm' | 'alert';
  onConfirm: () => void;
  onCancel: () => void;
}

export function useDialog() {
  const [state, setState] = React.useState<DialogState>({
    open: false,
    message: '',
    type: 'alert',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = React.useCallback(
    (
      message: string,
      options?: {
        title?: string;
        confirmText?: string;
        cancelText?: string;
        variant?: 'info' | 'warning' | 'danger';
      }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          open: true,
          type: 'confirm',
          message,
          title: options?.title,
          confirmText: options?.confirmText,
          cancelText: options?.cancelText,
          variant: options?.variant,
          onConfirm: () => {
            setState((s) => ({ ...s, open: false }));
            resolve(true);
          },
          onCancel: () => {
            setState((s) => ({ ...s, open: false }));
            resolve(false);
          },
        });
      });
    },
    []
  );

  const alert = React.useCallback(
    (
      message: string,
      options?: {
        title?: string;
        confirmText?: string;
        variant?: 'info' | 'success' | 'warning' | 'error';
      }
    ): Promise<void> => {
      return new Promise((resolve) => {
        setState({
          open: true,
          type: 'alert',
          message,
          title: options?.title,
          confirmText: options?.confirmText,
          variant: options?.variant as any,
          onConfirm: () => {
            setState((s) => ({ ...s, open: false }));
            resolve();
          },
          onCancel: () => {
            setState((s) => ({ ...s, open: false }));
            resolve();
          },
        });
      });
    },
    []
  );

  const DialogComponent = React.useMemo(
    () => (
      <>
        {state.type === 'confirm' ? (
          <ConfirmDialog
            open={state.open}
            title={state.title}
            message={state.message}
            confirmText={state.confirmText}
            cancelText={state.cancelText}
            variant={state.variant as 'info' | 'warning' | 'danger'}
            onConfirm={state.onConfirm}
            onCancel={state.onCancel}
          />
        ) : (
          <AlertDialog
            open={state.open}
            title={state.title}
            message={state.message}
            confirmText={state.confirmText}
            variant={state.variant as 'info' | 'success' | 'warning' | 'error'}
            onConfirm={state.onConfirm}
          />
        )}
      </>
    ),
    [state]
  );

  return { confirm, alert, DialogComponent };
}
