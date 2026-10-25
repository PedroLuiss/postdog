import React from 'react';

//Material UI
import { Tooltip, Zoom } from '@mui/material';
import { FiInfo as FiInfoIcon } from 'react-icons/fi';

//Styles
import styles from '../../../assets/styles/ui/InfoTooltip.module.scss';

//Types
import { InfoTooltipProps } from '../../../types/dashboard.type';

const FiInfo = FiInfoIcon as any;

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, placement = 'top', classNameInfoIcon = '' }) => {
    return (
        <Tooltip
            title={title}
            placement={placement}
            arrow
            slots={{ transition: Zoom }}
            slotProps={{
                tooltip: {
                    className: styles.customTooltip
                },
            }}
        >
            <span className={`${styles.infoIcon} ${classNameInfoIcon}`}>
                <FiInfo />
            </span>

        </Tooltip>
    );
};

export default InfoTooltip;
