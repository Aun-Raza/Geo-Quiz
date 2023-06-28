/* eslint-disable linebreak-style */
import React from 'react';

interface TableBodyProps {
  rows: {
    [key: string]: { text: string | number; element?: JSX.Element };
  }[];
}

function TableBody({ rows }: TableBodyProps) {
  return (
    <tbody>
      {rows.map((row) => {
        return (
          <tr key={row._id.text}>
            {Object.values(row).map((column, index) => {
              return (
                <td key={column.text.toString() + index}>
                  {column.element || column.text}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default TableBody;
