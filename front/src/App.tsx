import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/appRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/react-query/quertClient';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={appRouter} />
        </QueryClientProvider>
    );
}

export default App;
