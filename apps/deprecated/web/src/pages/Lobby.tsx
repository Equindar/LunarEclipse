const Lobby = () => {
  return (
    <main className="relative z-10 mx-auto max-w-screen-xl pt-16">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="text-mycolor rounded-lg bg-primary-dark p-4 shadow">Liste von Gruppen</div>
        <div className="flex flex-col px-4">
          <div className="mb-4 w-full rounded-lg bg-red-600 p-4 shadow">
            Gruppen-Aktion beitreten / verlassen
          </div>
          <div className="w-full rounded-lg bg-cyan-700 p-4 shadow sm:block">Gruppen-Info</div>
        </div>
      </div>
    </main>
  );
};

export default Lobby;
