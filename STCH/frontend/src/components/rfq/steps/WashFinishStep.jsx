
const washOptions = ["Normal Wash", "Enzyme Wash", "Stone Wash", "Acid Wash", "Bleach Wash", "Garment Dye"];

function WashFinishStep({ formData, setFormData }) {
  const toggleWash = (wash) => {
    const exists = formData.garmentWash.includes(wash);
    setFormData({
      ...formData,
      garmentWash: exists 
        ? formData.garmentWash.filter(i => i !== wash) 
        : [...formData.garmentWash, wash]
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-semibold text-white">Wash & Finish</h2>
      <p className="text-zinc-400 mt-2 mb-8">Select all applicable wash and treatment types.</p>

      <div className="flex flex-wrap gap-4">
        {washOptions.map((wash) => (
          <button
            key={wash}
            type="button"
            onClick={() => toggleWash(wash)}
            className={`px-6 py-3 rounded-2xl border transition-all duration-200 font-medium ${
              formData.garmentWash.includes(wash)
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "bg-[#0F141D] border-[#2A3142] text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {wash}
          </button>
        ))}
      </div>
    </div>
  );
}

export default WashFinishStep;