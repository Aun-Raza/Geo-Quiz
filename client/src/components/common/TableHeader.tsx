import * as React from "react";

interface TableHeaderProps {
    columns: string[];
}

function TableHeader({ columns }: TableHeaderProps) {
    return (
        <thead>
            <tr>
                {columns.map((column) => {
                    return <th key={column}>{column}</th>;
                })}
            </tr>
        </thead>
    );
}

export default TableHeader;
