import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: (props) => <h2 className="mt-8 text-xl font-bold text-[#1A2B4C]" {...props} />,
  h2: (props) => <h3 className="mt-6 text-lg font-bold text-[#1A2B4C]" {...props} />,
  h3: (props) => <h4 className="mt-5 text-base font-bold text-[#1A2B4C]" {...props} />,
  p: (props) => <p className="mt-4 leading-relaxed text-[#1A2B4C]" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-1 pl-5 text-[#1A2B4C]" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-1 pl-5 text-[#1A2B4C]" {...props} />,
  a: (props) => (
    <a
      className="font-semibold text-[#14B8A6] underline-offset-2 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-bold text-[#1A2B4C]" {...props} />,
  code: (props) => (
    <code className="rounded bg-[#1A2B4C]/5 px-1.5 py-0.5 text-sm" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="mt-4 border-l-4 border-[#2DD4BF]/40 pl-4 text-muted" {...props} />
  ),
  table: (props) => <table className="mt-4 w-full border-collapse text-sm" {...props} />,
  th: (props) => (
    <th className="border border-[#1A2B4C]/10 bg-[#F8FAFC] px-3 py-2 text-left font-semibold" {...props} />
  ),
  td: (props) => <td className="border border-[#1A2B4C]/10 px-3 py-2" {...props} />,
  hr: (props) => <hr className="mt-6 border-[#1A2B4C]/10" {...props} />,
};

export function MarkdownBody({ body }: { body: string }) {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
