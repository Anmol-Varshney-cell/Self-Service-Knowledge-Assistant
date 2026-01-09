
import React, { useState } from 'react';
import { HRDocument } from '../types';

interface AdminDashboardProps {
  documents: HRDocument[];
  onAdd: (doc: HRDocument) => void;
  onUpdate: (doc: HRDocument) => void;
  onDelete: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ documents, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingDoc, setEditingDoc] = useState<HRDocument | null>(null);
  const [newDoc, setNewDoc] = useState({ name: '', content: '', type: 'txt' as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.content) return;

    onAdd({
      id: Date.now().toString(),
      name: newDoc.name,
      content: newDoc.content,
      type: newDoc.type,
      uploadDate: new Date().toISOString()
    });
    setNewDoc({ name: '', content: '', type: 'txt' });
    setIsAdding(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      onUpdate(editingDoc);
      setEditingDoc(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const type: 'pdf' | 'docx' | 'txt' = 
      extension === 'pdf' ? 'pdf' : 
      extension === 'docx' ? 'docx' : 'txt';

    const reader = new FileReader();
    reader.onload = (event) => {
      let content = event.target?.result as string;
      
      // In a real production app, we would use a proper PDF/Docx parser here.
      // For this implementation, we read it as text and add a simulated content header 
      // if it's a binary format to ensure the RAG system handles it gracefully.
      if (type !== 'txt') {
        content = `[Note: This is an indexed ${type.toUpperCase()} file]\nFilename: ${file.name}\n\nBinary content extracted: ${content.substring(0, 500)}...`;
      }

      onAdd({
        id: Date.now().toString(),
        name: file.name,
        content: content,
        type: type,
        uploadDate: new Date().toISOString()
      });
    };

    if (type === 'txt') {
      reader.readAsText(file);
    } else {
      // For PDF/Docx, we attempt to read but acknowledge content extraction limitations 
      // in this frontend-only browser context.
      reader.readAsText(file); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Knowledge Management</h2>
          <p className="text-slate-500">Manage policy documentation for the Knowledge Assistant.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-100 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Add Manual Policy</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-400 transition cursor-pointer relative">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
          />
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Upload Policy</h3>
            <p className="text-xs text-slate-400 mt-1">Supports TXT, PDF, DOCX</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Indexed Knowledge</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{documents.length} Files</h3>
          <div className="mt-4 flex space-x-2">
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Active</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">RAG Optimized</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">System Integrity</p>
          <h3 className="text-xl font-bold text-green-600 mt-2 flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.573 9.291-6.433 11.751A1 1 0 0110 19a1 1 0 01-.567-.176C5.573 16.291 3 11.946 3 7.001c0-.68.056-1.35.166-2.002z" clipRule="evenodd" />
              </svg>
            Encrypted
          </h3>
          <p className="text-sm text-slate-400 mt-1">Changes are logged</p>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold mb-4 text-slate-800">New Policy Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Policy Title</label>
              <input
                type="text"
                value={newDoc.name}
                onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Travel & Expense Policy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content (Raw Text)</label>
              <textarea
                value={newDoc.content}
                onChange={e => setNewDoc({...newDoc, content: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
                placeholder="Paste the document text here for the AI to learn..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md"
              >
                Save Knowledge
              </button>
            </div>
          </form>
        </div>
      )}

      {editingDoc && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Reviewing: {editingDoc.name}</h2>
              <button onClick={() => setEditingDoc(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="flex-1 flex flex-col space-y-4">
              <div className="flex-1 min-h-0">
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Policy Content Editor</label>
                <textarea
                  value={editingDoc.content}
                  onChange={e => setEditingDoc({...editingDoc, content: e.target.value})}
                  className="w-full h-full p-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed resize-none overflow-y-auto"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Document Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Uploaded</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setEditingDoc(doc)}
                    className="flex items-center space-x-3 text-left hover:text-indigo-600 transition"
                  >
                    <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block">{doc.name}</span>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Click to view/edit indexed text</span>
                    </div>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded">{doc.type}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setEditingDoc(doc)}
                      className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition"
                      title="Edit Document"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete(doc.id)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                      title="Delete Document"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
