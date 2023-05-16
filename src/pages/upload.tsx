import { useState } from 'react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onUpload = async () => {
    const data = new FormData();
    data.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });

    const responseBody = await response.json();
    setUrl(`https://your-api-url/maps/${responseBody.link}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload your map</h1>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
        <button className="w-full p-3 mt-4 bg-indigo-600 text-white rounded shadow hover:bg-indigo-500" onClick={onUpload}>Upload</button>
        {url &&
          <div className="mt-6 text-center">
            <p className="text-2xl font-semibold">Share this URL:</p>
            <a className="text-indigo-500" href={url}>{url}</a>
          </div>}
      </div>
    </div>
  );
};

export default UploadPage;
