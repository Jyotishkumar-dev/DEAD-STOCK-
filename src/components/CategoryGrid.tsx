import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { CategoryItem } from '../types';
import { ArrowRight, Laptop, Cable, Smartphone, Cpu, Printer, Radio, AlertCircle } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: CategoryItem) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const renderCategoryGraphic = (type: CategoryItem['svgType']) => {
    switch (type) {
      case 'laptops':
        return (
          <div className="w-full h-40 bg-gradient-to-br from-[#234D35] to-[#1c3e2b] rounded-2xl flex items-center justify-center relative overflow-hidden text-[#FFFEFA] p-4">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                <Laptop className="w-8 h-8 text-[#DCE5D5]" />
              </div>
              <span className="text-xs font-mono text-[#DCE5D5]/80">ITAD / Fleet Laptops</span>
            </div>
          </div>
        );
      case 'cables':
        return (
          <div className="w-full h-40 bg-gradient-to-br from-[#3b5e4a] to-[#234D35] rounded-2xl flex items-center justify-center relative overflow-hidden text-[#FFFEFA] p-4">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                <Cable className="w-8 h-8 text-[#DCE5D5]" />
              </div>
              <span className="text-xs font-mono text-[#DCE5D5]/80">High-Purity Copper Cables</span>
            </div>
          </div>
        );
      case 'mobile':
        return (
          <div className="w-full h-40 bg-gradient-to-br from-[#4a6b57] to-[#234D35] rounded-2xl flex items-center justify-center relative overflow-hidden text-[#FFFEFA] p-4">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                <Smartphone className="w-8 h-8 text-[#DCE5D5]" />
              </div>
              <span className="text-xs font-mono text-[#DCE5D5]/80">Handhelds & Tablets</span>
            </div>
          </div>
        );
      case 'circuits':
        return (
          <div className="w-full h-40 bg-gradient-to-br from-[#234D35] to-[#2d523c] rounded-2xl flex items-center justify-center relative overflow-hidden text-[#FFFEFA] p-4">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                <Cpu className="w-8 h-8 text-[#DCE5D5]" />
              </div>
              <span className="text-xs font-mono text-[#DCE5D5]/80">Server PCBs & Memory</span>
            </div>
          </div>
        );
      case 'printers':
        return (
          <div className="w-full h-40 bg-gradient-to-br from-[#536a5c] to-[#234D35] rounded-2xl flex items-center justify-center relative overflow-hidden text-[#FFFEFA] p-4">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                <Printer className="w-8 h-8 text-[#DCE5D5]" />
              </div>
              <span className="text-xs font-mono text-[#DCE5D5]/80">Office Telecom & Laser</span>
            </div>
          </div>
        );
      case 'misc':
      default:
        return (
          <div className="w-full h-40 bg-gradient-to-br from-[#3d5a49] to-[#1c3e2b] rounded-2xl flex items-center justify-center relative overflow-hidden text-[#FFFEFA] p-4">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                <Radio className="w-8 h-8 text-[#DCE5D5]" />
              </div>
              <span className="text-xs font-mono text-[#DCE5D5]/80">Sensors & Lab Electronics</span>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="categories" className="py-20 bg-[#F7F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl text-left">
            <div className="text-xs font-semibold tracking-widest uppercase text-[#626B45] mb-2">
              MATERIAL INTAKE STREAMS
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#252A25] font-normal tracking-tight">
              Featured Recovery Categories
            </h2>
            <p className="text-sm sm:text-base text-[#777A72] mt-2">
              Browse eligible electronic equipment categories supported across our authorized recycler network.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#626B45] bg-[#DCE5D5]/50 px-4 py-2 rounded-xl border border-[#234D35]/10 max-w-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#234D35]" />
            <span>Safety first: Do not attempt to puncture or dismantle hazardous batteries manually.</span>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="group bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#626B45]/50 rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(35,77,53,0.12)] flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Visual Header */}
                <div className="mb-5 overflow-hidden rounded-2xl group-hover:scale-[1.01] transition-transform duration-300">
                  {renderCategoryGraphic(cat.svgType)}
                </div>

                {/* Category Title */}
                <h3 className="font-serif-heading text-xl text-[#252A25] font-normal mb-2 group-hover:text-[#234D35] transition-colors">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#777A72] leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Examples */}
                <div className="mb-5">
                  <div className="text-[11px] font-semibold text-[#626B45] uppercase tracking-wider mb-2">
                    Common Items Included:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.examples.map((ex, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#F7F4EC] text-[#252A25] border border-[#E6E2D8]/80"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Pathway Tag & Action */}
              <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#234D35]">
                  {cat.primaryPathway}
                </span>

                <button
                  onClick={() => onSelectCategory(cat)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234D35] hover:text-[#1a3a28] cursor-pointer group-hover:underline underline-offset-4"
                >
                  <span>Log Items</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
