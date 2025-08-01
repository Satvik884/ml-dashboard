"use client"
import {Upload, Sliders, BrainCircuit, TreeDeciduous, Rocket } from "lucide-react"; 
import {FunctionSquare, Trees,MoveDiagonal, Users, TrendingUp} from "lucide-react"; 
import { useRouter ,useSearchParams} from "next/navigation";
import { useDataset } from "../context/DatasetContext"; 
import Header from "../components/header";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import { useState,useEffect } from "react";



export default function ClassificationPage() {
    const searchParams = useSearchParams();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const models = [
        { 
            name: "Logistic Regression", 
            description: "A linear model used for binary and multi-class classification.", 
            icon: <Sliders size={20} className="text-blue-500" /> 
        },
        { 
            name: "Decision Tree Classifier", 
            description: "Uses a tree-like model to make decisions and classify data.", 
            icon: <TreeDeciduous size={20} className="text-orange-500" /> 
        },
        { 
            name: "Random Forest Classifier", 
            description: "An ensemble of decision trees to improve classification accuracy.", 
            icon: <Trees size={20} className="text-green-500" /> 
        },
        { 
            name: "Support Vector Machine (SVM)", 
            description: "Maximizes the margin between classes using hyperplanes.", 
            icon: <BrainCircuit size={20} className="text-purple-500" /> 
        },
        { 
            name: "K-Nearest Neighbors (KNN) Classifier", 
            description: "Classifies based on the majority class among k-nearest neighbors.", 
            icon: <Users size={20} className="text-pink-500" /> 
        },
        { 
            name: "Naive Bayes", 
            description: "A probabilistic classifier based on Bayes' theorem.", 
            icon: <FunctionSquare size={20} className="text-yellow-500" /> 
        },
        { 
            name: "Gradient Boosting Classifier (GBC)", 
            description: "An ensemble method that builds classifiers sequentially to improve accuracy.", 
            icon: <TrendingUp size={20} className="text-cyan-500" /> 
        },
        { 
            name: "XGBoost Classifier", 
            description: "An optimized and regularized gradient boosting classifier.", 
            icon: <Rocket size={20} className="text-blue-500" /> 
        },
        { 
            name: "Ridge Classifier", 
            description: "A linear classifier using L2 regularization to prevent overfitting.", 
            icon: <MoveDiagonal size={20} className="text-red-500" /> 
        },
    ];

    type ClassificationTrainingResult = {
        message: string;
        metrics: {
          accuracy: number;
          precision: number;
          recall: number;
          f1_score: number;
          confusion_matrix: number[][];
        };
        model_info: {
          feature_importances?: number[];
        };
      };
      
    const {X_train,X_test,y_train,y_test} = useDataset();
    const [selectedModel, setSelectedModel] = useState(models[0].name);
    const [showFullDataset, setShowFullDataset] = useState(false);
    const { dataset, setDataset, datasetFile, setDatasetFile } = useDataset();
    const [trainingResults, setTrainingResults] = useState<Record<string, ClassificationTrainingResult>>({});
    const result = trainingResults[selectedModel];

    useEffect(() => {
        const model = searchParams.get('model');
        if (model) {
            setSelectedModel(model);
            //console("Model selected from URL:", model);
        }
        }, [searchParams]);

    
    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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
    
    const handleProceedToPreprocessing = () => {
        if (!datasetFile) {
            alert("Please upload a dataset first!");
            return;
        }
        router.push("/prep_class"); 
    };

    const handleTrainModel = async () => {
        if (!X_train || !X_test || !y_train || !y_test || X_train.length < 2) {
          alert("Missing or insufficient data to train.");
          return;
        }
      
        const payload = {
          model_name: selectedModel,
          X_train,
          y_train,
          X_test,
          y_test,
          session_id: "user-session-id-001"
        };
      
        try {
          const response = await fetch(`${baseURL}/train-classifier`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
      
          const result = await response.json();
          //console("Result:",result)
          setTrainingResults(prev => ({
            ...prev,
            [selectedModel]: result
          }));
        } catch (err) {
          console.error("Training failed", err);
          alert("Training failed: " + err);
        }
      };

    return (
        <div className=" h-screen bg-gradient-to-r from-black to-gray-1000">
            <Header></Header>
            <div className="flex border-t border-t-gray-600 border-t-3 mt-18">
            <aside className="w-72 min-w-72 p-6 flex-shrink-0 h-screen overflow-y-auto">
                <h2 className="text-xl font-bold text-white-500">Regression Models</h2>
                <div className="mt-4 space-y-4">    
                    {models.map((model) => (
                        <button
                            key={model.name}
                            className={`block w-full p-3 text-left rounded-lg border transition-all duration-300 transition-transform duration-300 hover:scale-105 ${
                                selectedModel === model.name 
                                ? "border-white-600 bg-gradient-to-r from-black to-gray-800 text-white" 
                                : "hover:border-gray-600 hover:bg-gradient-to-r from-black to-gray-800"
                      
                            }`}
                            onClick={() => setSelectedModel(model.name)}
                        >
                            <div className="flex items-center gap-3">
                                {model.icon} 
                                <span className="font-semibold">{model.name}</span>
                            </div>
                            <p className="text-white-400 text-sm mt-1">{model.description}</p> 
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-auto h-screen">
                <h1 className="text-3xl font-bold">{selectedModel}</h1>
                
                {!dataset ? (
                    <div className="mt-6 p-6 rounded-lg text-center transition-transform duration-300 hover:scale-105">
                        <label className="cursor-pointer flex flex-col items-center">
                            <Upload size={40} className="text-white-500" />
                            <span className="mt-2 text-white">Click to upload dataset</span>
                            <input type="file" className="hidden" onChange={handleUpload} />
                        </label>
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
                            className="mt-4 bg-gradient-to-r from-black to-gray-800 text-white border border-white px-4 py-2 rounded-lg font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => setShowFullDataset(true)}
                        >
                            Expand Dataset
                        </button>
                        <button
                            className="mt-4 ml-4 bg-gradient-to-r from-black to-gray-800 text-white border border-white px-4 py-2 rounded-lg font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handleClearDataset()}
                        >
                            Clear Dataset
                        </button>
                    </div>
                )}

                <div className="mt-6 p-6 rounded-lg text-gray-300 bg-gray-800 ">
                    <h2 className="text-xl font-bold text-white">Data Preprocessing</h2>
                    <p className="mt-2 text-sm leading-relaxed">
                        Before training a machine learning model, raw data needs to be cleaned and transformed 
                        into a suitable format. Data preprocessing ensures that your dataset is structured, 
                        free of inconsistencies, and ready for analysis.
                    </p>     

                    <p className="mt-4 text-sm">
                        Skipping data preprocessing can lead to inaccurate predictions, biased models, and poor performance. 
                        It&apos;s an essential step to ensure high-quality results from machine learning models.
                    </p>

                    <button
                        className="mt-4 bg-gradient-to-r from-black to-gray-800 text-white border border-white px-4 py-2 rounded-lg font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
                        onClick={handleProceedToPreprocessing}
                        >
                        Proceed to Data Preprocessing
                    </button>
                </div>

                <div className="mt-6 p-6 rounded-lg text-gray-300 bg-gray-800 ">
                <h2 className="text-xl font-bold text-white">Training Data</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                Training data is the foundation of any machine learning model. It consists of input examples — typically rows of structured data — 
                along with their corresponding labels or target values (in supervised learning). This data is used by the model to learn patterns, 
                relationships, and behaviors that can later be applied to unseen data.
                </p>     

                <p className="mt-4 text-sm text-gray-300">
                The accuracy and effectiveness of any machine learning model depend heavily on the quality and quantity of the training data. 
                Inadequate or biased training data can lead to unreliable predictions and poor generalization to new inputs.
                </p>


                    <button
                        className="mt-4 bg-gradient-to-r from-black to-gray-800 text-white border border-white px-4 py-2 rounded-lg font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
                        onClick={handleTrainModel}
                        >
                        Start Training
                    </button>
                    

                </div>

                {result && (
                    <div className="mt-6 p-6 rounded-2xl bg-gray-900 text-gray-300 shadow-xl ring-1 ring-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Model Evaluation Results</h2>

                        <p className="mb-2 text-lg text-indigo-300">{result.message}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm md:text-base">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="text-white font-semibold"> Accuracy</h3>
                            <p>{result.metrics.accuracy}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="text-white font-semibold">Precision</h3>
                            <p>{result.metrics.precision}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="text-white font-semibold">F1 Score</h3>
                            <p>{result.metrics.f1_score}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="text-white font-semibold"> Recall</h3>
                            <p>{result.metrics.recall}</p>
                        </div>
                        </div>

                        {result.metrics.confusion_matrix && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-indigo-300 mb-3"> Confusion Matrix</h3>
                                <div className="overflow-x-auto">
                                <table className="table-auto border-collapse border border-gray-600 w-full">
                                    <tbody>
                                    {result.metrics.confusion_matrix.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <td
                                            key={colIndex}
                                            className="border border-gray-200 px-4 py-2 text-center text-white"
                                            >
                                            {cell}
                                            </td>
                                        ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            )}
                    </div>
                    )}

                {showFullDataset && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-6 z-50">
                        <h2 className="text-2xl font-bold text-white mb-4">Full Dataset</h2>
                        <div className="overflow-auto max-h-[80vh] w-11/12 bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <table className="w-full border-collapse text-sm text-white">
                                <thead>
                                    <tr className="bg-gray-700">
                                        {dataset?.[0]?.map((col:string, idx:number) => (
                                            <th key={idx} className="p-2 border">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataset?.map((row:string[], idx:number) => (
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
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
                            onClick={() => setShowFullDataset(false)}
                        >
                            Close
                        </button>
                    </div>
                )}

            </main>
            </div>
        </div>
    );

}