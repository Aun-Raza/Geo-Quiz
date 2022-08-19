import * as React from 'react';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

interface TableProps {
  data: {
    columns: { path: string }[];
    rows: {
      [key: string]: { text: string | number; element?: JSX.Element };
    }[];
  };
}

function Table({ data }: TableProps) {
  return (
    <table className='table table-hover my-3'>
      <TableHeader columns={data.columns} />
      <TableBody rows={data.rows} />
    </table>
  );
}

export default Table;
