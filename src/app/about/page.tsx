"use client"
import Header from "../components/header";


import { FileUpload } from "../components/ui/file-upload";
import { useDataset } from "../context/DatasetContext"; 
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import { useRouter } from "next/navigation";

export default function About() {

  const { dataset, setDataset, setDatasetFile } = useDataset();
  const router = useRouter();

  const handleSelect = (type: "regression" | "classification") => {
    router.push(`/${type}`);
  };

    const handleUpload = (files: File[]) => {
        const file = files?.[0];
        if (file) {
        setDatasetFile(file);
        parseCSV(file);
        }
    };

    const parseCSV = (file: File) => {
        Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result: ParseResult<string[]>) => {
            setDataset(result.data as string[][]);
        },
        });
    };

    const handleClearDataset = () => {
        setDataset(null);
        setDatasetFile(null);
    }
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-30">
      {!dataset ? (
                    <div className="w-full max-w-4xl mx-auto min-h-86 border border-dashed rounded-lg">
                        <FileUpload onChange={handleUpload} />
                    </div>
                ) : (
                    <div className="mt-6  p-6 rounded-lg bg-gray-800 ">
                        <h2 className="text-xl font-bold">Dataset Preview</h2>
                        <div className="mt-4 max-h-60 overflow-auto border border-gray-600 rounded-md p-2">
                            <table className="w-full border-collapse text-sm min-w-max">
                                
                                <thead>
                                    <tr className="bg-gray-700 text-white">
                                        {dataset?.[0]?.map((col:string, idx:number) => (
                                            <th key={idx} className="p-2 border">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {dataset && Array.isArray(dataset) && dataset.slice(1).map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-600">
                                        {row.map((cell:string, i:number) => (
                                            <td key={i} className="p-2 border">{cell}</td>
                                        ))}
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                      
                        <button
                            className="mt-4 ml-4 bg-gradient-to-r from-black to-gray-800 text-white border border-white px-4 py-2 rounded-lg font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handleClearDataset()}
                        >
                            Clear Dataset
                        </button>
                    </div>
        )}

        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-4xl font-bold mb-10">Choose Your Model</h1>
            <div className="flex gap-8">
                <button
                onClick={() => handleSelect("regression")}
                className="bg-gray-800 hover:bg-purple-600 text-white p-6 rounded-lg w-64 hover:scale-105 transition-all cursor-pointer"
                >
                <h2 className="text-2xl font-semibold">Regression</h2>
                <p className="text-sm text-gray-300 mt-2">Predict numbers (e.g., price, score).</p>
                </button>

                <button
                onClick={() => handleSelect("classification")}
                className="bg-gray-800 hover:bg-pink-600 text-white p-6 rounded-lg w-64 hover:scale-105 transition-all cursor-pointer"
                >
                <h2 className="text-2xl font-semibold">Classification</h2>
                <p className="text-sm text-gray-300 mt-2">Predict categories (e.g., spam/ham).</p>
                </button>
            </div>
            </div>
        
        
      </div>
    </>
  );
}
