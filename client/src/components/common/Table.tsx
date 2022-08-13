import * as React from 'react';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

interface TableProps {
    data: {
        columns: string[];
        rows: { [key: string]: string | number }[];
    };
}

function Table({ data }: TableProps) {
  return (
    <table className='table table-hover my-3'>
      <TableHeader columns={data.columns} />
      <TableBody data={data.rows} />
    </table>
  );
}

export default Table;
