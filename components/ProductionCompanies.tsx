import React from "react";
import Image from "next/image";

interface Company {
  id: number;
  name: string;
  logo_path?: string;
}

interface ProductionCompaniesProps {
  companies: Company[];
}

const ProductionCompanies: React.FC<ProductionCompaniesProps> = ({ companies }) => {
  if (!companies || companies.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Production</h3>
      <div className="flex flex-wrap gap-3">
        {companies.slice(0, 4).map(company => (
          <div
            key={company.id}
            className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2"
          >
            {company.logo_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                alt={company.name}
                width={24}
                height={24}
                className="w-6 h-6 object-contain rounded"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2">
                  <rect x="1" y="3" width="10" height="8" rx="1"/>
                  <path d="M1 6h10"/>
                </svg>
              </div>
            )}
            <span className="text-white/80 text-sm font-medium">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionCompanies;
