import { PageDefaults } from '@/components';
import { CreateEvents } from '@/components/pages';
import { CreateEventProvider } from '@/context/CreateEventContext';

const Create = async () => {
  return (
    <main className="bg-background text-textHeading h-[100dvh] max-w-[100vw] flex">
      <PageDefaults />
      <CreateEventProvider>
        <CreateEvents />
      </CreateEventProvider>
    </main>
  );
};

export default Create;