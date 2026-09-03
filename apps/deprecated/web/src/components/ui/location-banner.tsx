type LocationBannerProps = {
  title: string;
  subtitle?: string;
};

const LocationBanner = (props: LocationBannerProps) => {
  return (
    <div className="z-5 fixed left-1/4 top-1/4 h-screen w-screen animate-fade opacity-0">
      <div className="relative box-border h-auto w-1/2 border-2 border-x-transparent bg-gradient-to-r from-transparent via-slate-900 p-5 text-center text-white opacity-70 [border-image:linear-gradient(to_right,transparent,white,transparent)_50]">
        <h1 className="text-2xl font-bold">{props.title}</h1>
        {props.subtitle ?? <h2>{props.subtitle}</h2>}
      </div>
    </div>
  );
};

export default LocationBanner;
