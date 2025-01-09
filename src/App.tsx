import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Chat } from './components/Chat';
import { Document, Message } from './types';
import { FileText } from 'lucide-react';

// Helper function to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function App() {
  const [document, setDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcess = (content: string, fileName: string, fileType: string, data: any[], columns: string[]) => {
    setDocument({
      id: generateId(),
      name: fileName,
      content,
      type: fileType,
      data,
      columns
    });
    setMessages([{
      id: generateId(),
      content: `I've processed your Excel file "${fileName}". The file contains ${data.length} rows and ${columns.length} columns: ${columns.join(', ')}. Feel free to ask questions about the data!`,
      role: 'assistant',
      timestamp: new Date(),
    }]);
  };

  const findRelevantColumn = (question: string, columns: string[]) => {
    return columns.find(col => question.toLowerCase().includes(col.toLowerCase()));
  };

  const compareValues = (a: any, b: any) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    return String(a).localeCompare(String(b));
  };

  const analyzeData = (question: string, data: any[]) => {
    const questionLower = question.toLowerCase();
    let response = '';
    let visualization = undefined;

    // Handle comparison questions
    if (questionLower.includes('compare') || questionLower.includes('versus') || questionLower.includes('vs')) {
      const column = findRelevantColumn(question, document?.columns || []);
      if (column) {
        const values = data.reduce((acc: any, curr: any) => {
          const value = curr[column];
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {});

        const vizData = Object.entries(values)
          .sort((a, b) => compareValues(a[0], b[0]))
          .map(([name, value]) => ({ name, value }));

        response = `Here's a comparison of ${column} values:`;
        visualization = {
          type: 'bar',
          data: vizData
        };
      }
    }
    // Handle distribution questions
    else if (questionLower.includes('distribution') || questionLower.includes('breakdown')) {
      const column = findRelevantColumn(question, document?.columns || []);
      if (column) {
        const distribution = data.reduce((acc: any, curr: any) => {
          const value = curr[column];
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {});

        const vizData = Object.entries(distribution)
          .sort((a, b) => b[1] as any - (a[1] as any))
          .map(([name, value]) => ({ name, value }));

        response = `Here's the distribution of ${column}:`;
        visualization = {
          type: 'pie',
          data: vizData
        };
      }
    }
    // Handle trend questions
    else if (questionLower.includes('trend') || questionLower.includes('over time')) {
      const column = findRelevantColumn(question, document?.columns || []);
      if (column) {
        const trend = data.reduce((acc: any, curr: any) => {
          const value = curr[column];
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {});

        const vizData = Object.entries(trend)
          .sort((a, b) => compareValues(a[0], b[0]))
          .map(([name, value]) => ({ name, value }));

        response = `Here's the trend for ${column}:`;
        visualization = {
          type: 'line',
          data: vizData
        };
      }
    }
    // Handle average/mean questions
    else if (questionLower.includes('average') || questionLower.includes('mean')) {
      const column = findRelevantColumn(question, document?.columns || []);
      if (column) {
        const values = data.map(item => parseFloat(item[column])).filter(val => !isNaN(val));
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        response = `The average ${column} is ${average.toFixed(2)}.`;
      }
    }
    // Handle count/total questions
    else if (questionLower.includes('how many') || questionLower.includes('count') || questionLower.includes('total')) {
      const column = findRelevantColumn(question, document?.columns || []);
      if (column) {
        const uniqueValues = new Set(data.map(item => item[column]));
        response = `There are ${uniqueValues.size} unique values in ${column} out of ${data.length} total records.`;
      } else {
        response = `There are ${data.length} records in total.`;
      }
    }
    // Handle maximum/minimum questions
    else if (questionLower.includes('highest') || questionLower.includes('maximum') || 
             questionLower.includes('lowest') || questionLower.includes('minimum')) {
      const column = findRelevantColumn(question, document?.columns || []);
      if (column) {
        const values = data.map(item => item[column]);
        const isMax = questionLower.includes('highest') || questionLower.includes('maximum');
        const extremeValue = isMax ? Math.max(...values) : Math.min(...values);
        response = `The ${isMax ? 'highest' : 'lowest'} ${column} is ${extremeValue}.`;
      }
    }

    if (!response) {
      response = "I'm not sure how to answer that question. Try asking about distributions, comparisons, trends, averages, or counts for specific columns.";
    }

    return { response, visualization };
  };

  const handleSendMessage = async (content: string) => {
    if (!document) return;

    const newMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);

    const { response, visualization } = analyzeData(content, document.data);

    const aiResponse: Message = {
      id: generateId(),
      content: response,
      role: 'assistant',
      timestamp: new Date(),
      visualization
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Excel Q&A Assistant</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!document ? (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Upload your Excel file</h2>
            <FileUpload onFileProcess={handleFileProcess} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Current Document</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{document.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Rows:</strong> {document.data.length}</p>
                    <p><strong>Columns:</strong> {document.columns.length}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Available Columns:</h3>
                    <div className="flex flex-wrap gap-2">
                      {document.columns.map((column) => (
                        <span
                          key={column}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {column}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow h-[600px]">
                <Chat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isProcessing={isProcessing}
                  document={document}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}