import Link from "next/link";
import { Upload, Cpu, BarChart3 } from "lucide-react";
import Header from "./components/header";

export default function Home() {
    return (
        <div className="flex flex-col bg-gradient-to-r from-black to-gray-800">
            <Header></Header>
            <div className="h-[550px]  flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-5xl font-bold text-white ">Transform Your Data into Intelligence</h2>
                <p className="mt-4 text-lg text-white max-w-2xl ">
                    Upload your dataset, select an AI model, and let AI do the work.
                </p>

                <div className="mt-6">
                    <Link href="/regression">
                        <button className="w-70 bg-gradient-to-r from-purple-500 to-purple-700 text-white-500 px-6 py-3 rounded-lg text-lg font-bold shadow-lg hover:scale-105 mr-2 ">
                            Regression
                        </button>
                    </Link>
                    <Link href="/classification">
                        <button className="w-70 bg-gradient-to-r from-purple-500 to-purple-700 text-white-500 px-6 py-3 rounded-lg text-lg font-bold shadow-lg hover:scale-105 ml-2 ">
                            Classification
                        </button>
                    </Link>
                </div>
            </div>

            <div className=" text-white py-20 px-6">
                <h2 className="text-center text-4xl font-bold mb-12">Why Choose Trainify AI?</h2>
                
                <div className="flex flex-wrap justify-center gap-8">
                    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg w-80 text-center transition-transform duration-300 hover:scale-105">
                        <Upload size={40} className="text-purple-500 mx-auto" />
                        <h3 className="text-xl font-bold mt-4">Easy Data Upload</h3>
                        <p className="text-gray-400 mt-2">
                            Simply drag and drop your CSV files to start training your models.
                        </p>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg w-80 text-center transition-transform duration-300 hover:scale-105">
                        <Cpu size={40} className="text-purple-500 mx-auto" />
                        <h3 className="text-xl font-bold mt-4">Automated ML</h3>
                        <p className="text-gray-400 mt-2">
                            Our system automatically handles model training and optimization.
                        </p>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg w-80 text-center transition-transform duration-300 hover:scale-105">
                        <BarChart3 size={40} className="text-purple-500 mx-auto" />
                        <h3 className="text-xl font-bold mt-4">Visual Insights</h3>
                        <p className="text-gray-400 mt-2">
                            Get clear visual reports and performance metrics for your models.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
