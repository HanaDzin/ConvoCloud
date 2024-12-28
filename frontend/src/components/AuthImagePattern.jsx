import images from "../data/images.js";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-5 mb-8">
          {images.map((image, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl transition-all duration-75 hover:scale-105 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              <img
                src={image} // Use the imported image variable directly
                alt={`Pattern ${i + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
