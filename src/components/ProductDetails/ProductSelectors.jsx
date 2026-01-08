import React from "react";
import { Check } from "lucide-react";

const ProductSelectors = ({
  availableAttributes,
  selectedAttributes,
  onSelect,
  checkAvailability,
}) => {
  return (
    <div className="space-y-6 mb-8">
      {Object.entries(availableAttributes).map(([attrName, values]) => (
        <div key={attrName}>
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Select {attrName}:{" "}
            <span className="text-lagoon-600">
              {selectedAttributes[attrName]}
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {values.map((val) => {
              const isSelected = selectedAttributes[attrName] === val.name;
              const isAvailable = checkAvailability(attrName, val.name);

              if (attrName.toLowerCase() === "color") {
                return (
                  <button
                    key={val.id}
                    onClick={() => isAvailable && onSelect(attrName, val.name)}
                    disabled={!isAvailable}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? "ring-2 ring-lagoon-500 ring-offset-2 border-transparent"
                        : "border-gray-200"
                    } ${
                      !isAvailable
                        ? "opacity-40 cursor-not-allowed overflow-hidden relative"
                        : "hover:border-gray-300 cursor-pointer"
                    }`}
                    title={
                      isAvailable ? val.name : `${val.name} (Out of Stock)`
                    }
                    style={{ backgroundColor: val.code || "#ccc" }}
                  >
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-500 transform -rotate-45"></div>
                        <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
                      </div>
                    )}

                    {isSelected && isAvailable && (
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={val.id}
                  onClick={() => isAvailable && onSelect(attrName, val.name)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all relative ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200"
                  } ${
                    !isAvailable
                      ? "opacity-50 cursor-not-allowed decoration-red-500"
                      : "hover:border-gray-900 cursor-pointer"
                  }`}
                >
                  <span
                    className={
                      !isAvailable
                        ? "line-through decoration-2 decoration-red-500"
                        : ""
                    }
                  >
                    {val.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSelectors;
