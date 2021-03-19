// NOTE: Only get entities from dxf file for rendering
import React, { useState } from 'react';
import DxfParser from 'dxf-parser';

const dxfParser = new DxfParser();

export const DxfUploader: React.FC = () => {
  const [json, setJson] = useState<JSON>();
  const handleUploadFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { files } = event.target;

    if (!files) return;

    const reader = new FileReader();
    reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (!result) return;

      const dxfJson = dxfParser.parseSync(result);
      // Get entities data only for rendering
      setJson(dxfJson.entities);
    });

    reader.readAsBinaryString(files[0]);
  };
  return (
    <div>
      <input type="file" onChange={handleUploadFile} />
      <a
        href={`data:text/json;charset=utf-8,${JSON.stringify(json)}`}
        download="floorMap.json"
      >
        Download file
      </a>
    </div>
  );
};
