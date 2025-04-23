import toast from 'react-hot-toast';

// Toast success
const success = (message: string = 'Successfully!', options = {}) => toast.success(message, options);

// Toast error
const error = (message: string = 'Error!', options = {}) => toast.error(message, options);

// Toast loading
const loading = (message: string = 'Loading...', options = {}) => toast.loading(message, options);

// Toast promise
const promise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
  options = {},
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    ...options,
  });
};

// Dismiss all toast
const dismiss = () => toast.dismiss();

export const Toast = {
  success,
  error,
  loading,
  promise,
  dismiss,
};
