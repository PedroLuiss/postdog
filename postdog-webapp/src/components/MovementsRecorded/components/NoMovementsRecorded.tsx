import React from 'react';
import { NoMovementsEmptyProps } from '../Type/NoMovementsRecorded.Type';
import { ArrowRightLeftIcon, PawPrintIcon } from '../icons/NoMovementIcons';

export const NoMovementsEmpty: React.FC<NoMovementsEmptyProps> = ({
    title,
    description,
    buttonText,
    handleAction
}) => (
    <div className="card-empty-state">
        <div className="card-empty-state__inner">
            <div className="card-empty-state__icon-container">
                <ArrowRightLeftIcon className="text-white" />
                <div className="badge-paw">
                    <PawPrintIcon />
                </div>
            </div>

            <div className="card-empty-state__info">
                <h2 className="title">{title}</h2>
                <p className="description">{description}</p>
            </div>

            <button className="btn-agregar-creditos" onClick={handleAction}>
                <span>{buttonText}</span>
            </button>
        </div>
    </div>
);
