"use client";

import { useState } from "react";
import { resourceCreators } from "./resource-creators";

export function AddResourcePanel({ sectionId }: { sectionId: string }) {
  const [activeId, setActiveId] = useState(resourceCreators[0].id);
  const active = resourceCreators.find((creator) => creator.id === activeId) ?? resourceCreators[0];

  return (
    <div className="border-t border-line pt-5">
      <p className="text-sm font-medium text-foreground">Agregar recurso</p>
      <div role="tablist" aria-label="Tipo de recurso" className="mt-3 flex flex-wrap gap-2">
        {resourceCreators.map((creator) => {
          const isActive = creator.id === active.id;
          return (
            <button
              key={creator.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(creator.id)}
              className={`h-10 rounded-sm border px-4 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-navy bg-navy text-white"
                  : "border-navy/25 text-foreground hover:border-navy hover:bg-navy/5"
              }`}
            >
              {creator.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="mt-5">
        <active.Form sectionId={sectionId} />
      </div>
    </div>
  );
}
