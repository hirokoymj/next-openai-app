interface PageHeaderInfo {
  title: string;
  repoUrl: string;
  referenceUrl?: string;
  referenceLabel?: string;
  stack?: string[];
}

export function PageHeader({ headerInfo }: { headerInfo: PageHeaderInfo }) {
  const { title, repoUrl, stack } = headerInfo;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5 mb-10">
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-center mb-3">{title}</h1>

      {/* DIVIDER */}
      <div className="border-b border-blue-200 my-3"></div>

      {/* INFO ROW */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-gray-700">
        <a
          href={repoUrl}
          target="_blank"
          className="text-blue-700 font-medium hover:underline">
          <b>Github:</b> Code
        </a>

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
