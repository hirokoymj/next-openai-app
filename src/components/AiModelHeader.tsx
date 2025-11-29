interface AiHeaderInfo {
  title: string;
  provider: string;
  model: string;
  repoUrl: string;
  referenceUrl?: string;
  referenceLabel?: string;
  stack?: string[];
}

export function AiModelHeader({ headerInfo }: { headerInfo: AiHeaderInfo }) {
  const {
    title,
    provider,
    model,
    repoUrl,
    referenceUrl,
    referenceLabel,
    stack,
  } = headerInfo;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5 mb-10">
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-center mb-3">{title}</h1>

      {/* DIVIDER */}
      <div className="border-b border-blue-200 my-3"></div>

      {/* INFO ROW */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-700">
        <span>
          <b>Provider:</b> {provider}
        </span>
        <span>|</span>
        <span>
          <b>Model:</b> {model}
        </span>
        <span>|</span>
        <a
          href={repoUrl}
          target="_blank"
          className="text-blue-700 font-medium hover:underline">
          Code
        </a>

        {referenceUrl && referenceLabel && (
          <>
            <span>|</span>
            <a
              href={referenceUrl}
              target="_blank"
              className="text-blue-700 font-medium hover:underline">
              {referenceLabel}
            </a>
          </>
        )}

        {stack && (
          <>
            <span>|</span>
            <span>
              <b>Stack:</b> {stack.join(', ')}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
