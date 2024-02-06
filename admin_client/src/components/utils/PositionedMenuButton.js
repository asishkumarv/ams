// PositionMenuButton.js
import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const PositionedMenuButton = ({ label, menuItems }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button color="inherit" onClick={handleClick} endIcon={<KeyboardArrowDownIcon />}>
                {label}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {menuItems.map((item, index) => (
                    <MenuItem key={index} onClick={handleClose} component={Link} to={item.link}>
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default PositionedMenuButton;
