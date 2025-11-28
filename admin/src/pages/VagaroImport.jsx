import React, { useState } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, FileText, Calendar, Loader } from 'lucide-react';
import { backendUrl } from '../App';

const VagaroImportTool = () => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState([]);
  const [showMappingHelp, setShowMappingHelp] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
      previewCSV(selectedFile);
    }
  };

  const previewCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').slice(0, 6);
      const rows = lines.map(line => {
        return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      });
      setPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setImporting(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${backendUrl}/api/admin/import-vagaro`, {
        method: 'POST',
        body: formData,
      });

      // Check response status first
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Import failed';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status}): ${errorText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }

      // Get response text first to check if it's valid
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from server. Please check server logs.');
      }

      // Handle successful response
      if (data.success) {
        setResult(data);
        setFile(null);
        setPreview([]);
      } else {
        setError(data.message || 'Import failed');
      }

    } catch (err) {
      console.error('Import error:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['Client Name', 'Email', 'Phone', 'Service', 'Provider', 'Date', 'Time', 'Duration', 'Price', 'Status', 'Notes'],
      ['John Doe', 'john@email.com', '555-0123', 'Swedish Massage', 'Jane Smith', '12/15/2024', '2:00 PM', '90', '150', 'Confirmed', 'Client prefers soft pressure'],
      ['Jane Smith', 'jane@email.com', '555-0124', 'Deep Tissue Massage', 'John Doe', '12/16/2024', '10:30 AM', '60', '120', 'Confirmed', ''],
      ['Bob Johnson', 'bob@email.com', '555-0125', 'Hot Stone Massage', 'Jane Smith', '12/17/2024', '3:00 PM', '90', '160', 'Pending', 'First time client'],
    ];

    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vagaro-import-sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Import Appointments from Vagaro
        </h1>
        <p className="text-gray-600">
          Upload your Vagaro appointment export to migrate appointments to your new system
        </p>
      </div>

      {/* Instructions Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <FileText size={20} />
          Before You Start
        </h2>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span className="font-semibold">1.</span>
            <span>Export your appointments from Vagaro as a CSV file</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">2.</span>
            <span>Make sure the CSV includes: Client Name, Email, Phone, Service, Provider, Date, Time</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">3.</span>
            <span>Test with a few appointments first before importing all</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">4.</span>
            <span>Keep your original CSV file as backup</span>
          </li>
        </ol>

        <div className="mt-4 flex gap-3">
          <button
            onClick={downloadSampleCSV}
            className="text-sm px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Download Sample CSV
          </button>
          <button
            onClick={() => setShowMappingHelp(!showMappingHelp)}
            className="text-sm px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {showMappingHelp ? 'Hide' : 'Show'} Column Mapping Guide
          </button>
        </div>
      </div>

      {/* Column Mapping Guide */}
      {showMappingHelp && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">CSV Column Names</h3>
          <p className="text-sm text-gray-600 mb-3">
            Your CSV should have these columns (names may vary):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Client Name</div>
              <div className="text-gray-500 text-xs">or "Customer Name"</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Email</div>
              <div className="text-gray-500 text-xs">or "Client Email"</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Phone</div>
              <div className="text-gray-500 text-xs">or "Client Phone"</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Service</div>
              <div className="text-gray-500 text-xs">or "Service Name"</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Provider</div>
              <div className="text-gray-500 text-xs">or "Staff" or "Therapist"</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Date</div>
              <div className="text-gray-500 text-xs">MM/DD/YYYY format</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Time</div>
              <div className="text-gray-500 text-xs">HH:MM AM/PM</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Duration</div>
              <div className="text-gray-500 text-xs">in minutes</div>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900">Price</div>
              <div className="text-gray-500 text-xs">dollar amount</div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV File</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          
          <div className="mb-4">
            <label className="cursor-pointer">
              <span className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block">
                Select CSV File
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {file && (
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {preview.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Preview (First 5 rows)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {preview[0].map((header, i) => (
                      <th key={i} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(1).map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 text-gray-600">
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

        {/* Import Button */}
        {file && (
          <div className="mt-6">
            <button
              onClick={handleImport}
              disabled={importing}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                importing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {importing ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Importing... Please wait
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Import Appointments
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">Import Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Import Completed!</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{result.imported || 0}</div>
              <div className="text-sm text-gray-600">Successfully Imported</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{result.skipped || 0}</div>
              <div className="text-sm text-gray-600">Skipped (Duplicates)</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{result.failed || 0}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{result.total || 0}</div>
              <div className="text-sm text-gray-600">Total Processed</div>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-red-200 mt-4">
              <h4 className="font-semibold text-red-900 mb-2">Error Details:</h4>
              <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <div key={i} className="text-red-700 bg-red-50 p-2 rounded">
                    <span className="font-medium">Row {err.row}</span> ({err.client}): {err.error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Next Steps
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Verify appointments in the calendar</li>
              <li>✓ Check provider schedules for conflicts</li>
              <li>✓ Send migration notification emails to clients</li>
              <li>✓ Keep Vagaro active for 1-2 weeks as backup</li>
            </ul>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Imported appointments will be marked as "paid" from Vagaro</li>
              <li>Services and providers will be auto-matched by name</li>
              <li>New user accounts will be created for clients not in your system</li>
              <li>Duplicate appointments (same date/time/client) will be skipped</li>
              <li>You can import the same file multiple times safely</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VagaroImportTool;