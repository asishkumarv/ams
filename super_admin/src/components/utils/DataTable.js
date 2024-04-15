import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Button,
} from '@mui/material';

const DataTable = ({ data, columns, handleAction }) => {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return (
      <Typography variant="body2">
        No data available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.key === 'name' && `${row.first_name} ${row.last_name}`}
                  {column.key !== 'name' && (column.formatter ? column.formatter(row[column.key]) : row[column.key])}
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="text"
                  color={row.status === 'active' ? 'secondary' : 'primary'}
                  onClick={() => handleAction(row)}
                >
                  {row.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;

