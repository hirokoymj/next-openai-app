'use client';

interface ExampleItem {
  prompt: string;
  image: string;
}

export function ExampleTable({
  examples,
  onSelect,
}: {
  examples: ExampleItem[];
  onSelect: (item: ExampleItem) => void;
}) {
  return (
    <div className="mt-10 bg-white shadow rounded-lg overflow-hidden">
      <h2 className="text-xl font-bold px-4 py-3 bg-gray-100 border-b">
        Example AI generated images
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 border-b font-semibold text-gray-600">
              Prompt
            </th>
            <th className="px-4 py-3 border-b font-semibold text-gray-600">
              Image
            </th>
          </tr>
        </thead>

        <tbody>
          {examples.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onSelect(row)}
              className="cursor-pointer hover:bg-blue-50 transition">
              <td className="px-4 py-3 border-b text-gray-700">{row.prompt}</td>
              <td className="px-4 py-3 border-b">
                <img
                  src={`/images/${row.image}`}
                  alt={row.prompt}
                  className="h-16 w-auto rounded object-cover border"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
