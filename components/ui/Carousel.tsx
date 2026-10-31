import { Children, type ReactNode } from "react";

type CarouselColumns = 2 | 3 | 4;

interface CarouselProps {
  children: ReactNode;
  columns: CarouselColumns;
}

const gridColumnClasses: Record<CarouselColumns, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export function Carousel({ children, columns }: CarouselProps) {
  return (
    <div
      className={`-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:gap-5 md:overflow-visible md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${gridColumnClasses[columns]}`}
    >
      {Children.map(children, (child) => (
        <div className="flex w-[82%] shrink-0 snap-start md:w-auto [&>*]:w-full">{child}</div>
      ))}
    </div>
  );
}
