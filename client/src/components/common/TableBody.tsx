import * as React from 'react';

interface TableBodyProps {
  data: {
    [key: string]: string | number;
  }[];
}

function TableBody({ data }: TableBodyProps) {
  return (
    <tbody>
      {data.map((row) => {
        return (
          <tr key={row._id}>
            {Object.values(row).map((value, index) => {
              return <td key={row._id.toString() + index}>{value}</td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
}

export default TableBody;
