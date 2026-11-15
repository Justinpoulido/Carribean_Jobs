import { Sparkles } from "lucide-react";
import { parseTipBody } from "@/lib/tips";

export function TipBody({ body }: { body: string }) {
  const blocks = parseTipBody(body);
  return (
    <div className="grid gap-5 text-lg leading-8 text-slate-700">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") {
          return (
            <h2 key={key} className="pt-2 text-xl font-bold text-slate-950">
              {block.text}
            </h2>
          );
        }
        if (block.type === "bonus") {
          return (
            <aside
              key={key}
              className="flex gap-3 rounded-lg border border-[#f59e0b]/40 bg-[#fff7ed] p-5 text-base leading-7 text-slate-800"
            >
              <Sparkles size={20} className="mt-1 shrink-0 text-[#c2410c]" aria-hidden="true" />
              <p>
                <span className="font-bold text-[#c2410c]">Bonus tip: </span>
                {block.text}
              </p>
            </aside>
          );
        }
        if (block.type === "list") {
          return block.ordered ? (
            <ol key={key} className="grid gap-3">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0077b6] text-sm font-black text-white">
                    {itemIndex + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <ul key={key} className="grid gap-3">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-4">
                  <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-[#10b981]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}
