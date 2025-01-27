import { PageDefaults } from '@/components';
import { CreateEvents } from '@/components/pages';

const Create = async () => {
  return (
    <main className="bg-background text-textHeading h-[100dvh] max-w-[100vw] flex">
      <PageDefaults />
      <CreateEvents />
    </main>
  );
};

export default Create;