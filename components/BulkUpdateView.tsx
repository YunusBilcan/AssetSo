
import React, { useRef, useState } from 'react';
import { ICONS } from '../constants';

interface BulkUpdateViewProps {
  onBulkUpdate: (content: string) => void;
  onCancel: () => void;
}

const BulkUpdateView: React.FC<BulkUpdateViewProps> = ({ onBulkUpdate, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleDownloadSample = () => {
    const csvContent = "sku,price,reason\nIFS-1000-B,950.00,Seasonal Discount\nECOS-2024-ENT,2350.00,Annual Adjustment";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "bulk_price_update_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleProcess = () => {
    if (fileContent) {
      onBulkUpdate(fileContent);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
        <p className="text-gray-500">Update pricing for thousands of assets instantly using a structured data file.</p>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <ICONS.Edit />
             </div>
             <div>
                <h2 className="font-bold text-gray-900">Step 1: Download Template</h2>
                <p className="text-xs text-gray-500">Use our specific CSV format to ensure data integrity.</p>
             </div>
          </div>
          <button 
            onClick={handleDownloadSample}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-black font-bold text-sm rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            Download Sample CSV
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                   <ICONS.Package />
                </div>
                <div>
                   <h2 className="font-bold text-gray-900">Step 2: Upload Updated File</h2>
                   <p className="text-xs text-gray-500">Upload your modified CSV file with the new prices and reasons.</p>
                </div>
             </div>

             <div 
               onClick={() => fileInputRef.current?.click()}
               className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                 fileName ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-400 bg-gray-50/30'
               }`}
             >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".csv" 
                  className="hidden" 
                />
                <div className="flex flex-col items-center">
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${fileName ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                      <ICONS.Plus />
                   </div>
                   {fileName ? (
                     <div>
                        <p className="text-lg font-bold text-indigo-600">{fileName}</p>
                        <p className="text-sm text-indigo-400">File ready for processing</p>
                     </div>
                   ) : (
                     <div>
                        <p className="text-lg font-bold text-gray-900">Drop your file here or click to browse</p>
                        <p className="text-sm text-gray-400">Supported format: .csv</p>
                     </div>
                   )}
                </div>
             </div>
          </section>

          <div className="flex gap-4 pt-4 border-t border-gray-50">
            <button 
              onClick={handleProcess}
              disabled={!fileContent}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              Start Bulk Update Process
            </button>
            <button 
              onClick={onCancel}
              className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
        <div className="p-2 bg-amber-200 rounded-lg h-fit text-amber-700">
           <ICONS.Info />
        </div>
        <div>
           <h4 className="font-bold text-amber-900 text-sm">Security Audit Warning</h4>
           <p className="text-xs text-amber-700 mt-1 leading-relaxed">
             All bulk price changes will be logged under your account (**Jane Doe**). 
             Incorrect SKU formats in the file will be skipped. Ensure the 'reason' column 
             is filled to maintain high-quality audit trails.
           </p>
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateView;
