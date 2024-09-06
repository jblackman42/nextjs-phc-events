import { PageDefaults, Calendar } from '@/components';

const Home = async () => {
  return (
    <main className="bg-background text-textHeading h-[100dvh] max-w-[100vw] flex">
      <PageDefaults />
      <Calendar />
    </main>
  );
};

export default Home;
