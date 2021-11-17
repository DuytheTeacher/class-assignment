import { DataGrid } from '@mui/x-data-grid';

const Table = (props) => {
  const { participants } = props;

  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'firstName', headerName: 'First name', width: 170 },
    { field: 'lastName', headerName: 'Last name', width: 170 },
    {
      field: 'account',
      headerName: 'Account',
      width: 170,
    },
    { field: 'email', headerName: 'Email', width: 300 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 250,
      valueGetter: (params) =>
        `${params.getValue(params.id, 'firstName') || ''} ${
          params.getValue(params.id, 'lastName') || ''
        }`,
    },
    { field: 'role', headerName: 'Role', with: 200 }
  ];

  const rows = participants.map((item, index) => {
      return {
          id: index + 1,
          firstName: item.first_name,
          lastName: item.last_name,
          account: item.account_name,
          email: item.email,
          role: item.user_type ? 'Teacher' : 'Student'
      }
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
};

export default Table;
