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
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

const DataTable = ({ data, columns, idField = 'id' }) => {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return (
      <Typography variant="body2">
        No data available.
      </Typography>
    );
  }

  return (
    <Box mt={2}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={row[idField]}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {/* Wrap cell content with Link component */}
                    <Link
                      to={`/organisationdetails/${row[idField]}`}
                      style={{ textDecoration: 'none', color: 'Primary', cursor: 'pointer' }}
                    >
                      {row[column.key]}
                    </Link>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataTable;
