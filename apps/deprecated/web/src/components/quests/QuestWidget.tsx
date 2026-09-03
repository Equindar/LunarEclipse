interface QuestWidgetProps {
  position: string;
}

const QuestWidget = () => {
  return (
    <div className="w-1/8 absolute left-0 top-1/3 h-auto bg-background p-5 text-black opacity-60 dark:bg-background-dark dark:text-white">
      <h1 className="text-2xl font-bold">Quest Widget</h1>
      <ul className="relative">
        <li>Quest #1</li>
        <li>Quest #2</li>
        <li>Quest #3</li>
      </ul>
    </div>
  );
};

export default QuestWidget;
