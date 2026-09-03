import LoginForm from '@/components/login/LoginForm';

const LandingPage = () => {
  return (
    <div className="relative z-0 grid gap-4 md:grid-cols-2">
      <div></div>
      <section className="bg-background opacity-80 shadow dark:border dark:border-gray-700 dark:bg-background-dark transition-colors duration-200">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <LoginForm />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
