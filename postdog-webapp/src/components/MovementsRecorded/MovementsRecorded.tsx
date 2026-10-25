import React from 'react';
import { useNoMovementsRecorded } from './Hook/useNoMovementsRecorded';
import { useMovements } from './Hook/useMovements';
import { NoMovementsRecordedProps } from './Type/NoMovementsRecorded.Type';
import { NoMovementsEmpty } from './components/NoMovementsRecorded';
import { MovementsTable } from './components/MovementsTable';
import './MovementsRecorded.scss';

const MovementsRecorded: React.FC<NoMovementsRecordedProps> = ({
    title = "No hay movimientos registrados",
    description = "Aquí podrás ver todas las operaciones realizadas en tu cuenta de Postdog.",
    buttonText = "Agregar créditos",
    onButtonClick
}) => {
    const { handleAddCredits } = useNoMovementsRecorded();
    const { transactions, loading } = useMovements();

    const handleAction = onButtonClick || handleAddCredits;

    if (loading) {
        return (
            <div className="movimientos-view">
                <div className="loading-container">
                    <p>Cargando movimientos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="movimientos-view">
            {transactions.length > 0 ? (
                <MovementsTable
                    buttonText={buttonText}
                    handleAction={handleAction}
                    transactions={transactions}
                />
            ) : (
                <NoMovementsEmpty
                    title={title}
                    description={description}
                    buttonText={buttonText}
                    handleAction={handleAction}
                />
            )}
        </div>
    );
};

export default MovementsRecorded;
