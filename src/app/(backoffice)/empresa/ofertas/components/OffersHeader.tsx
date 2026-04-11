interface OffersHeaderProps {
    empresaNombre: string;
  }
  
  export default function OffersHeader({ empresaNombre }: OffersHeaderProps) {
    return (
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-[#191C1D]">

          <span className="text-[#526600]">{empresaNombre}</span>
        </h1>
      </header>
    );
  }