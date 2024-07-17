import { PageDefaults, Calendar } from '@/components';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';

const Home = async () => {
  return (
    <main className="bg-background text-textHeading h-[100dvh] max-w-[100vw] flex gap-2 md:gap-4 md:p-4">
      <PageDefaults />
      {/* <Calendar /> */}
    </main>
  );
};

export default Home;
