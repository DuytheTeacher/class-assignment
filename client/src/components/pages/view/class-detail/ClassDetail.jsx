import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
// UI Components
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
// Services
import ClassroomService from '../../../../services/classroom.service';
// Components
import { ClassNews, Table } from '../../public';




const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ClassDetail = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const [value, setValue] = useState(0);

  const [classDetail, setClassDetail] = useState();
  const [participants, setParticipants] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getClassDetail = async () => {
    const resp = await ClassroomService.getClassDetail(path);
    setClassDetail(resp);
  };

  const getListParticipants = async () => {
      const resp = await ClassroomService.getListParticipants(path);
      setParticipants(resp.participants_id);
  };

  useEffect(() => {
    getClassDetail();
    getListParticipants();
  }, []);

  return (
    <div>
      <Box sx={{ width: '80%', 'margin': 'auto' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="NEWS" />
          <Tab label="PARTICIPANTS" />
          <Tab label="GRADES" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ClassNews classDetail={classDetail} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Table participants={participants}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
};

export default ClassDetail;