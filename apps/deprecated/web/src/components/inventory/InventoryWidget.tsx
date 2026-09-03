interface InventoryWidgetProps {}

const InventoryWidget = () => {
  return (
    <div className="flex h-96 w-1/4 border border-black bg-background opacity-60 dark:border-slate-500 dark:bg-background-dark">
      <div className="relative -top-16 left-1/2 -ml-16">
        <div className="absolute top-0 z-50 h-32 w-32 border border-black bg-background dark:border-slate-500 dark:bg-background-dark">
          {/* <img src="" alt="" width={104} height={104} className="m-3"/> */}
        </div>
        <div className="absolute -left-2 -top-2 z-20 h-36 w-36 rotate-45 border border-black bg-background dark:border-slate-500 dark:bg-background-dark"></div>
        <div className="absolute left-2 top-2 z-30 h-28 w-28 rotate-45 border border-black dark:border-slate-500"></div>
      </div>
      <div className="relative ml-16 h-full w-full border border-red-500 p-5 pt-28 text-black dark:text-white">
        <div className=" grid h-full w-full auto-rows-max gap-4 border border-red-500">
          <div className="h-16 w-16 border border-slate-500">02</div>
          <div className="h-16 w-16 border border-slate-500">03</div>
          <div className="h-16 w-16 border border-slate-500">01</div>
          <div className="h-16 w-16 border border-slate-500">02</div>
          <div className="h-16 w-16 border border-slate-500">03</div>
          <div className="h-16 w-16 border border-slate-500">01</div>
          <div className="h-16 w-16 border border-slate-500">02</div>
          <div className="h-16 w-16 border border-slate-500">03</div>
          <div className="h-16 w-16 border border-slate-500">01</div>
          <div className="h-16 w-16 border border-slate-500">02</div>
          <div className="h-16 w-16 border border-slate-500">03</div>
          <div className="h-16 w-16 border border-slate-500">02</div>
          <div className="h-16 w-16 border border-slate-500">03</div>
          <div className="h-16 w-16 border border-slate-500">01</div>
          <div className="h-16 w-16 border border-slate-500">02</div>
          <div className="h-16 w-16 border border-slate-500">03</div>
          <div className="h-16 w-16 border border-slate-500">01</div>
          <div className="h-16 w-16 border border-slate-500">02</div>
          <div className="h-16 w-16 border border-slate-500">03</div>
        </div>
        <h1>Inventory Widget</h1>
        <p>Content</p>
      </div>
    </div>
  );
};

export default InventoryWidget;
