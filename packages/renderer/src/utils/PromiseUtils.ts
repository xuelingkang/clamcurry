import toast from '@/components/Toast';

export default class PromiseUtils {
    public static toastError(error: Error) {
        toast.error(error.message);
    }
}
