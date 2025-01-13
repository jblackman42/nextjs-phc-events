import { PageDefaults, CreateEvents } from '@/components';

const Create = async () => {
  return (
    <main className="bg-background text-textHeading h-[100dvh] max-w-[100vw] flex">
      <PageDefaults />
      <CreateEvents />
    </main>
  );
};

export default Create;