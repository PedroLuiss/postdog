import React from "react";
import Button from '@mui/material/Button';

const CustomButton = ({ text, onClick, style }) => {
    return <Button variant="contained" onClick={onClick} style={style}>{text}</Button>;
};

export default CustomButton;
