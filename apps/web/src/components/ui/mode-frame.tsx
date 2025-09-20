type ModeFrameProps = {
  name: string;
  description?: string;
  timestamp?: number | undefined;
};

const ModeFrame = (props: ModeFrameProps) => {
  return (
    <div className="fixed z-10 box-border h-screen w-screen p-5">
      <div className="relative box-border h-full w-full rounded-lg border-4 border-gray-700">
        <div className="absolute bottom-0 right-0 rounded-tl-lg bg-slate-700 p-2 text-white">
          <h1 className="font-bold">Mode: {props.name}</h1>
          <p>
            {props.description}
            <span className="block text-right text-xs">
              {props.timestamp
                ? new Date(props.timestamp).toUTCString()
                : new Date(Date.now()).toUTCString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeFrame;
