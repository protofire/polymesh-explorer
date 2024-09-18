import React from 'react';

interface JsonViewerProps {
  data: unknown;
  space?: number;
}

export function JsonViewer({ data, space = 2 }: JsonViewerProps) {
  return (
    <pre
      style={{
        backgroundColor: '#f4f4f4',
        padding: '10px',
        borderRadius: '5px',
        overflow: 'auto',
        maxHeight: '400px',
        fontSize: '14px',
      }}
    >
      {JSON.stringify(data, null, space)}
    </pre>
  );
}
