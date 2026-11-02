"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  aside?: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIds?: string[];
}

export function Accordion({ items, defaultOpenIds = [] }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  const allOpen = openIds.length === items.length;

  const toggleItem = (id: string) =>
    setOpenIds((current) =>
      current.includes(id) ? current.filter((openId) => openId !== id) : [...current, id],
    );

  const toggleAll = () => setOpenIds(allOpen ? [] : items.map((item) => item.id));

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm font-semibold text-primary transition-colors hover:text-navy"
        >
          {allOpen ? "Colapsar todo" : "Expandir todo"}
        </button>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <li key={item.id} className="border border-line bg-surface">
              <h3>
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-${item.id}`}
                  className="flex w-full items-center gap-4 p-5 text-left md:px-6"
                >
                  <ChevronDownIcon
                    className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                      isOpen ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="flex-1 font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {item.title}
                  </span>
                  {item.aside && (
                    <span className="hidden text-sm text-muted sm:inline">{item.aside}</span>
                  )}
                </button>
              </h3>
              <div
                id={`accordion-${item.id}`}
                hidden={!isOpen}
                className="border-t border-line px-5 pb-5 pt-4 md:px-6"
              >
                {item.content}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
