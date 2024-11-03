import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';

interface CustomCardProps {
    title: string;
    description: string;
    imageUrl: string;
};

const CustomCard: React.FC<CustomCardProps> = ({
    title,
    description,
    imageUrl
}) => {
    return (
        <Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: 3 }}>
            <CardMedia
                component="img"
                image={imageUrl}
                alt={`${title} image`}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 object-cover"
            />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">Learn More</Button>
                <Button size="small" color="secondary">Share</Button>
            </CardActions>
        </Card>
    );
}


export default CustomCard;