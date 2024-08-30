import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/appRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/react-query/quertClient';
// import { NameInput } from '@/components/nameInputModal/NameInput';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={appRouter} />
        </QueryClientProvider>
    );
}

export default App;
