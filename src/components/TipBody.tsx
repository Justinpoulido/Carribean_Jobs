import { Sparkles } from "lucide-react";
import { parseTipBody } from "@/lib/tips";

export function TipBody({ body }: { body: string }) {
  const blocks = parseTipBody(body);
  return (
    <div className="grid gap-5 text-[1.0625rem] leading-8 text-ink-soft">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") {
          return (
            <h2 key={key} className="pt-3 font-display text-[22px] font-bold text-ocean">
              {block.text}
            </h2>
          );
        }
        if (block.type === "bonus") {
          return (
            <aside
              key={key}
              className="flex gap-3.5 rounded-brand border-2 border-sun/50 bg-sand p-5 leading-7 text-ink"
            >
              <Sparkles size={20} className="mt-1 shrink-0 text-sun-deep" aria-hidden="true" />
              <p>
                <span className="font-bold text-ocean">Bonus tip: </span>
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
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ocean font-display text-[14px] font-bold text-sun">
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
                  <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-turq" />
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
