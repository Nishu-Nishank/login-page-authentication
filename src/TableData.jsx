import React from 'react';

const TableData = ({ listData }) => {
  return (
    <table className="mt-10">
      <thead>
        <tr className="table-border">
          <th className="table-border">Id</th>
          <th className="table-border">Color</th>
          <th className="table-border">Name</th>
          <th className="table-border">Pantone value</th>
          <th className="table-border">Year</th>
        </tr>
      </thead>
      <tbody>
        {listData.map((item) => (
          <tr key={item.id} className="table-border">
            <td className="table-border">{item.id}</td>
            <td className="table-border">{item.color}</td>
            <td className="table-border">{item.name}</td>
            <td className="table-border">{item.pantone_value}</td>
            <td className="table-border">{item.year}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default TableData;
