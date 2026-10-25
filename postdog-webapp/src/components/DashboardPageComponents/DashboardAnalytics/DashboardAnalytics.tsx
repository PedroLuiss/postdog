import React from 'react';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import styles from './DashboardAnalytics.module.scss';
import { useDashboardAnalytics } from './hooks/useDashboardAnalytics';
import { DashboardAnalyticsSkeleton } from '../../ui/SkeletonUi/DashboardAnalyticsSkeleton/DashboardAnalyticsSkeleton';
import { STATE_ABBREVIATIONS } from './constant';

export const DashboardAnalytics: React.FC = () => {
    const {
        year,
        isLoading,
        charts,
        mappedActivity,
        mappedCarriers,
        mappedDestinations,
        handlePrevYear,
        handleNextYear,
        isNextYearDisabled
    } = useDashboardAnalytics(new Date().getFullYear());

    if (isLoading) return <DashboardAnalyticsSkeleton />;

    return (
        <div className={styles['dashboard-analytics']}>
            
            <section className={styles['dashboard-analytics__card']}>
                <div className={styles['dashboard-analytics__header']}>
                    <h3 className={styles['dashboard-analytics__title']}>Actividad anual</h3>
                    <div className={styles['dashboard-analytics__date-selector']}>
                        <button className={styles['dashboard-analytics__nav-btn']} onClick={handlePrevYear}>
                            <ChevronLeft />
                        </button>
                        <span className={styles['dashboard-analytics__current-date']}>{year}</span>
                        <button 
                            className={styles['dashboard-analytics__nav-btn']} 
                            onClick={handleNextYear}
                            disabled={isNextYearDisabled}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
                <div className={styles['dashboard-analytics__chart-container']}>
                    {mappedActivity.some(item => item.envios > 0) ? (
                        <ResponsiveContainer className={styles['dashboard-analytics__chart-container__chart-line']}>
                            <LineChart data={mappedActivity} margin={{ top: 10, right: 10, left: -20, bottom: 15 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"  />
                                <XAxis 
                                    dataKey="month" 
                                    fontSize={11} 
                                    axisLine={{ stroke: '#c5c5c5' }} 
                                    tick={{ fill: '#9ca3af' }}
                                />
                                <YAxis 
                                    fontSize={11} 
                                    axisLine={{ stroke: '#c5c5c5' }} 
                                    tick={{ fill: '#B3B3B3' }}
                                    domain={[0, charts?.annualActivityMeta.max || 'auto']}
                                />
                                <Tooltip contentStyle={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" align="center"  iconType="line" wrapperStyle={{ fontSize: '11px' }} />
                                <Line name="Envíos" type="monotone" dataKey="envios" stroke="#dc2626" strokeWidth={2} dot={false} />
                                {/* <Line name="Recargas ($)" type="monotone" dataKey="recargas" stroke="#2563eb" strokeWidth={2} dot={false} /> */}
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className={styles['dashboard-analytics__empty-message']}>
                            Aún no hay suficiente datos. Realiza tu primer envío.
                        </div>
                    )}
                </div>
            </section>

            <section className={styles['dashboard-analytics__card']}>
                <h3 className={styles['dashboard-analytics__title']} style={{ marginBottom: '1rem' }}>
                    Paqueterías más usadas
                </h3>
                <div className={styles['dashboard-analytics__chart-container']}>
                    {mappedCarriers.length > 0 ? (
                        <ResponsiveContainer className={styles['dashboard-analytics__chart-container__chart']}>
                            <BarChart data={mappedCarriers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    fontSize={11} 
                                    axisLine={{ stroke: '#B3B3B3' }}
                                    tick={{ fill: '#9ca3af' }}
                                />
                                <YAxis 
                                    fontSize={11} 
                                    axisLine={{ stroke: '#B3B3B3' }}
                                    tick={{ fill: '#B3B3B3' }}
                                    domain={[0, charts?.topCarriersMeta.max || 'auto']}
                                />
                                <Tooltip cursor={{ fill: '#c5c5c5' }} contentStyle={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="envios" radius={[4, 4, 0, 0]}>
                                    {mappedCarriers.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className={styles['dashboard-analytics__empty-message']}>
                            Aún no hay suficiente datos. Realiza tu primer envío.
                        </div>
                    )}
                </div>
            </section>

            <section className={styles['dashboard-analytics__card']}>
                <h3 className={styles['dashboard-analytics__title']} style={{ marginBottom: '1rem' }}>
                    Destinos más usados
                </h3>
                <div className={styles['dashboard-analytics__chart-container']}>
                    {mappedDestinations.length > 0 ? (
                        <ResponsiveContainer className={styles['dashboard-analytics__chart-container__chart']}>
                            <BarChart data={mappedDestinations} layout="vertical" margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis 
                                    type="number" 
                                    fontSize={11} 
                                    axisLine={{ stroke: '#B3B3B3' }}
                                    tick={{ fill: '#9ca3af' }}
                                    domain={[0, charts?.topDestinationsMeta.max || 'auto']}
                                />
                                <YAxis 
                                    dataKey="city" 
                                    type="category" 
                                    fontSize={9} 
                                    axisLine={{ stroke: '#B3B3B3' }} 
                                    width={60}
                                    tick={{ fill: '#B3B3B3' }}
                                    tickFormatter={(value) => STATE_ABBREVIATIONS[value] || value}
                                />
                                <Tooltip cursor={{ fill: '#c5c5c5' }} contentStyle={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                <Bar dataKey="envios" radius={[0, 4, 4, 0]}>
                                    {mappedDestinations.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className={styles['dashboard-analytics__empty-message']}>
                            Aún no hay suficiente datos. Realiza tu primer envío.
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
};