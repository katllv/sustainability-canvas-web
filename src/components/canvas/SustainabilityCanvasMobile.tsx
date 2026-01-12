import { CanvasSection } from './CanvasSection';
import { useState, useRef, useEffect } from 'react';
import { type Impact, type SectionType } from '@/api/impacts';

interface SustainabilityCanvasMobileProps {
  impacts: Impact[];
  onSectionClick: (section: SectionType, color: string) => void;
}

export function SustainabilityCanvasMobile({
  impacts,
  onSectionClick,
}: SustainabilityCanvasMobileProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const slideWidth = carousel.clientWidth;
      const gap = 12; // gap-3 = 0.75rem = 12px
      const currentSlide = Math.round(scrollLeft / (slideWidth + gap));
      setActiveSlide(Math.min(currentSlide, 2)); // Clamp to 0-2
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const slideWidth = carousel.clientWidth;
    const gap = 12; // gap-3 = 0.75rem = 12px
    carousel.scrollTo({ left: (slideWidth + gap) * index, behavior: 'smooth' });
  };

  const getImpactsForSection = (sectionType: string) => {
    return impacts.filter((impact: Impact) => impact.type === sectionType);
  };

  return (
    <>
      {/* Mobile carousel layout */}
      <div
        ref={carouselRef}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        className='sm:hidden flex-1 min-h-0 overflow-x-auto snap-x snap-mandatory flex gap-3 [&::-webkit-scrollbar]:hidden'>
        {/* Column 1: Blue sections */}
        <div className='min-w-full snap-start flex flex-col gap-3 min-h-0'>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Key Stakeholders (KS)'
              backgroundColor='bg-the-light-blue'
              impacts={getImpactsForSection('KS')}
              onClick={() => onSectionClick('KS', 'bg-the-light-blue')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Key Activities (KA)'
              backgroundColor='bg-the-light-blue'
              impacts={getImpactsForSection('KA')}
              onClick={() => onSectionClick('KA', 'bg-the-light-blue')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Waste Management (WM)'
              backgroundColor='bg-the-light-blue'
              impacts={getImpactsForSection('WM')}
              onClick={() => onSectionClick('WM', 'bg-the-light-blue')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Key Technology & Resources (KTR)'
              backgroundColor='bg-the-light-blue'
              impacts={getImpactsForSection('KTR')}
              onClick={() => onSectionClick('KTR', 'bg-the-light-blue')}
            />
          </div>
        </div>

        {/* Column 2: UVP + Cost + Revenue */}
        <div className='min-w-full snap-start flex flex-col gap-3 min-h-0'>
          <div className='flex-[1.5] min-h-0'>
            <CanvasSection
              title='Unique Value Proposition (UVP)'
              backgroundColor='bg-the-lavender'
              impacts={getImpactsForSection('UVP')}
              onClick={() => onSectionClick('UVP', 'bg-the-lavender')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Cost (CO)'
              backgroundColor='bg-the-orange'
              impacts={getImpactsForSection('CO')}
              onClick={() => onSectionClick('CO', 'bg-the-orange')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Revenue (RE)'
              backgroundColor='bg-the-green'
              impacts={getImpactsForSection('RE')}
              onClick={() => onSectionClick('RE', 'bg-the-green')}
            />
          </div>
        </div>

        {/* Column 3: Yellow sections */}
        <div className='min-w-full snap-start flex flex-col gap-3 min-h-0'>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Customer Relationship (CR)'
              backgroundColor='bg-the-yellow'
              impacts={getImpactsForSection('CR')}
              onClick={() => onSectionClick('CR', 'bg-the-yellow')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Customer Segment (CS)'
              backgroundColor='bg-the-yellow'
              impacts={getImpactsForSection('CS')}
              onClick={() => onSectionClick('CS', 'bg-the-yellow')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Channels (CH)'
              backgroundColor='bg-the-yellow'
              impacts={getImpactsForSection('CH')}
              onClick={() => onSectionClick('CH', 'bg-the-yellow')}
            />
          </div>
          <div className='flex-1 min-h-0'>
            <CanvasSection
              title='Governance (GO)'
              backgroundColor='bg-the-yellow'
              impacts={getImpactsForSection('GO')}
              onClick={() => onSectionClick('GO', 'bg-the-yellow')}
            />
          </div>
        </div>
      </div>

      {/* Mobile carousel indicators */}
      <div className='sm:hidden flex justify-center gap-2 py-3'>
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              activeSlide === index ? 'w-8 bg-the-dark-blue' : 'w-2 bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
