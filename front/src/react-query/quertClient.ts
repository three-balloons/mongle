import { APIException } from '@/api/exceptions';
import { QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            throwOnError: (error) => {
                if (error instanceof APIException) {
                    // if (error.code === 'NO_EXIST') return true;
                    return false;
                }
                return true;
            },
            retry: 0,
        },
    },

    queryCache: new QueryCache({
        onError(error) {
            if (error instanceof APIException) {
                console.error('APIException', error.message);
            }
        },
    }),
});
