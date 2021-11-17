import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const ClassCard = (props) => {
  const { classItem } = props;

  return (
    <Card sx={{ minWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={classItem.thumbnail}
        alt="class thumbnail"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {classItem.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {classItem.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small"><Link to={`/class/${classItem._id}`}>Detail</Link></Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default ClassCard;
