/* eslint-disable linebreak-style */
import * as React from 'react';

interface TableHeaderProps {
  columns: { path: string }[];
}

function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead>
      <tr>
        {columns.map((column) => {
          return <th key={column.path}>{column.path}</th>;
        })}
      </tr>
    </thead>
  );
}

export default TableHeader;
