import React from 'react';
import { MovementsTableProps } from '../Type/NoMovementsRecorded.Type';
import { Transaction } from '../../../types/wallet.type';

interface Props extends MovementsTableProps {
    transactions: Transaction[];
}

export const MovementsTable: React.FC<Props> = ({
    buttonText,
    handleAction,
    transactions
}) => (
    <>
        <div className="movimientos-header">
            <p className="header-text">Revisa las operaciones realizadas en tu cuenta.</p>
            <div className="header-actions">
                <button className="btn-agregar-creditos" onClick={handleAction}>
                    <span>{buttonText}</span>
                </button>
            </div>
        </div>

        <div className="movimientos-card">
            <div className="table-responsive">
                <table className="movimientos-table">
                    <thead>
                        <tr>
                            <th className="text-left">Fecha y hora</th>
                            <th className="text-left">Concepto</th>
                            <th className="text-right">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((mov) => (
                            <tr key={mov.uid}>
                                <td>
                                    <span className="fecha-texto">
                                        {new Date(mov.createdAt).toLocaleString('es-MX', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </span>
                                </td>
                                <td>
                                    <div className="concepto-titulo">{mov.uiConcept}</div>
                                    {mov.uiDescription && <div className="header-text">{mov.uiDescription}</div>}
                                </td>
                                <td className="text-right">
                                    <span className={mov.type === 'CREDIT' ? "cantidad-positiva" : "cantidad-negativa"}>
                                        {mov.type === 'CREDIT' ? `+ $${Number(mov.amount).toFixed(2)}` : `- $${Number(mov.amount).toFixed(2)}`} MXN
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
);
