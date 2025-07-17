// src/components/ShowDataset.tsx
import React from "react";

interface ShowDatasetProps {
  dataset: string[][] | null;
  title?: string;
}

const ShowDataset: React.FC<ShowDatasetProps> = ({ dataset }) => {
  if (!dataset || dataset.length === 0) {
    return <p>No dataset to display.</p>;
  }



  return (
    <div className="mt-4 max-h-60 overflow-auto border border-gray-600 rounded-md p-2">
        <table className="w-full border-collapse text-sm min-w-max">
        <thead>
            {dataset && dataset.length > 0 && dataset[0] ? (
                <tr className="bg-gray-700 text-white">
                    {dataset[0].map((col: string, idx: number) => (
                        <th key={idx} className="p-2 border">{col}</th>
                    ))}
                </tr>
            ) : (
                <tr>
                    <th className="p-2 border">No data available</th>
                </tr>
            )}
        </thead>
        <tbody>
            {dataset && dataset.length > 1 ? (
                dataset.slice(1).map((row: string[], idx: number) => (
                    <tr key={idx} className="border-t border-gray-600">
                        {row.map((cell: string, i: number) => (
                            <td key={i} className="p-2 border">{cell}</td>
                        ))}
                    </tr>
                ))
            ) : (
                <tr>
                    
                </tr>
            )}
        </tbody>

        </table>
    </div>
  );
};

export default ShowDataset;
