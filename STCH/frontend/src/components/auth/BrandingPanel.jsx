import logo from "../../assets/stch_logo.png";

function BrandingPanel() {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center px-12 text-center">

      {/* LOGO */}
      <img
        src={logo}
        alt="STCH Logo"
        className="w-52 object-contain"
      />

      {/* QUOTE */}
      <p className="mt-10 text-zinc-700 text-xl leading-relaxed max-w-md font-light">
        “Connecting sourcing, production, and delivery
        into one intelligent workflow.”
      </p>

    </div>
  );
}

export default BrandingPanel;