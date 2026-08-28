import React, { useState } from "react";
import { createPortal } from "react-dom";
import Stack from "./Stack";

const CERTS = [
  "certificate_page-0001.jpg",
  "img103.jpg",
  "img110.jpg",
  "img117.jpg",
  "img124.jpg",
  "img131.jpg",
  "img138.jpg",
  "img145.jpg",
  "img152.jpg",
  "img159.jpg",
  "img170.jpg",
  "img177.jpg",
  "img184.jpg",
  "img191.jpg",
  "img227.jpg",
  "img236.jpg",
  "img243.jpg",
  "img96.jpg",
  "mhara_tech_page-0001.jpg",
  "oracle.png",
  "python_tech_page-0001.jpg",
];

export default function CertificatesGallery() {
  const [selectedCert, setSelectedCert] = useState(null);

  const cards = CERTS.map((cert, index) => (
    <img
      key={index}
      src={`/certifications/${cert}`}
      alt={`Certificate ${index}`}
      className="w-full h-full object-cover rounded-xl"
      draggable={false}
    />
  ));

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="absolute top-16 md:top-24 text-center z-50 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
          &lt;Certifications /&gt;
        </h2>
        <p className="text-gray-400 mt-2 font-mono text-sm md:text-base animate-pulse">
          /* Drag to flip, click to view */
        </p>
      </div>

      <div className="relative mt-16 w-[280px] h-[200px] md:w-[450px] md:h-[320px] z-40">
        <Stack
          randomRotation={true}
          sensitivity={150}
          sendToBackOnClick={false}
          cards={cards}
          autoplay={false}
          onCardClick={(index) => {
            if (CERTS[index]) setSelectedCert(CERTS[index]);
          }}
        />
      </div>

      {/* Modal using createPortal to break out of all transform/overflow bounds */}
      {selectedCert &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md transition-all"
            onClick={() => setSelectedCert(null)}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-14 right-0 text-white hover:text-teal-400 transition-colors p-2 bg-black/50 rounded-full border border-gray-700"
                onClick={() => setSelectedCert(null)}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <img
                src={`/certifications/${selectedCert}`}
                alt="Selected Certificate"
                className="max-w-full max-h-[85vh] object-contain rounded-lg border-2 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.4)]"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
