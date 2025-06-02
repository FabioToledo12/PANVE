import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { Assessment } from '@/lib/utils/types';

// Registrar os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AssessmentBarChartProps {
    responses: Assessment['responses'];
}

// Estrutura mockada das perguntas e comportamentos para calcular o total possível
const assessmentStructure = {
    sectionA: [
        5, // Exemplo: A.1 tem 5 comportamentos possíveis
        4, // Exemplo: A.2 tem 4 comportamentos possíveis
        6, // Exemplo: A.3 tem 6 comportamentos possíveis
    ],
    sectionB: [
        6, // B.1 tem 6 comportamentos (4 Corp, 1 Sons, 1 Fac)
        6, // B.2 tem 6 comportamentos (3 Corp, 1 Sons, 1 Fac, 1 Vis)
        8, // B.3 tem 8 comportamentos (5 Corp, 1 Sons, 1 Fac, 1 Vis)
        7, // B.4 tem 7 comportamentos (4 Corp, 1 Sons, 1 Fac, 1 Vis)
    ],
    sectionC: Array.from({ length: 17 }, (_, i) => {
        // Assumindo 4 comportamentos por pergunta em C para simulação
        return 4;
    })
};


export const AssessmentBarChart: React.FC<AssessmentBarChartProps> = ({ responses }) => {
    // Função auxiliar para contar os status e calcular percentuais
    const calculateStatusPercentages = (questionResponses: Record<string, string> | undefined, totalBehaviors: number): { emergent: number, mastered: number, notUsed: number } => {
        if (!questionResponses || totalBehaviors === 0) {
            return { emergent: 0, mastered: 0, notUsed: 100 }; // 100% Não Usado se não houver respostas ou comportamentos totais
        }

        let emergentCount = 0;
        let masteredCount = 0;

        // Contar apenas os comportamentos presentes nas respostas
        Object.keys(questionResponses).forEach(behaviorKey => {
            const status = questionResponses[behaviorKey];
            if (status === 'emergent') emergentCount++;
            else if (status === 'mastered') masteredCount++;
        });

        const respondedCount = emergentCount + masteredCount;
        const notUsedCount = totalBehaviors - respondedCount;

        let emergentPercent = (emergentCount / totalBehaviors) * 100;
        let masteredPercent = (masteredCount / totalBehaviors) * 100;
        let notUsedPercent = (notUsedCount / totalBehaviors) * 100;

        // Ajuste para garantir que a soma seja 100% devido a arredondamentos
        const totalPercent = emergentPercent + masteredPercent + notUsedPercent;
        if (totalPercent > 100) {
            const diff = totalPercent - 100;
            if (masteredPercent >= emergentPercent && masteredPercent >= notUsedPercent) masteredPercent -= diff;
            else if (emergentPercent >= masteredPercent && emergentPercent >= notUsedPercent) emergentPercent -= diff;
            else notUsedPercent -= diff;
        } else if (totalPercent < 100 && notUsedCount >= 0) {
            notUsedPercent += (100 - totalPercent);
        }
        // Garantir que nenhum percentual seja negativo
        emergentPercent = Math.max(0, emergentPercent);
        masteredPercent = Math.max(0, masteredPercent);
        notUsedPercent = Math.max(0, notUsedPercent);



        return { emergent: emergentPercent, mastered: masteredPercent, notUsed: notUsedPercent };
    };

    // Processar dados das respostas para o gráfico empilhado em percentual
    const labels: string[] = [];
    const emergentPercentages: number[] = [];
    const masteredPercentages: number[] = [];
    const notUsedPercentages: number[] = [];

    const backgroundColors: Record<'emergent' | 'mastered' | 'not-used', string> = {
        'emergent': '#FFCE54', // Amarelo
        'mastered': '#48CFAD', // Verde
        'not-used': '#DDDDDD', // Cinza (para não usado/não respondido)
    };

    const borderColors: Record<'emergent' | 'mastered' | 'not-used', string> = {
        'emergent': '#E0B545', // Amarelo escuro
        'mastered': '#3DAA8B', // Verde escuro
        'not-used': '#B0B0B0', // Cinza escuro (para não usado/não respondido)
    };


    // Seção A (Nível 1) - 3 colunas/perguntas
    const sectionAQuestions = ['A.1', 'A.2', 'A.3'];
    sectionAQuestions.forEach((qId, index) => {
        const totalBehaviors = assessmentStructure.sectionA[index];
        const percentages = calculateStatusPercentages(responses?.sectionA?.[qId], totalBehaviors);
        labels.push(qId);
        emergentPercentages.push(percentages.emergent);
        masteredPercentages.push(percentages.mastered);
        notUsedPercentages.push(percentages.notUsed);
    });

    // Seção B (Nível 2) - 4 colunas/perguntas
    const sectionBQuestions = ['B.1', 'B.2', 'B.3', 'B.4'];
    sectionBQuestions.forEach((qId, index) => {
        const totalBehaviors = assessmentStructure.sectionB[index];
        const percentages = calculateStatusPercentages(responses?.sectionB?.[qId], totalBehaviors);
        labels.push(qId);
        emergentPercentages.push(percentages.emergent);
        masteredPercentages.push(percentages.mastered);
        notUsedPercentages.push(percentages.notUsed);
    });

    // Seção C (Nível 3) - 17 colunas/perguntas
    const sectionCQuestions = Array.from({ length: 17 }, (_, i) => `C.${i + 1}`);
    sectionCQuestions.forEach((qId, index) => {
        const totalBehaviors = assessmentStructure.sectionC[index];
        // Para a seção C, garantir que se não houver respostas salvas, ele use a contagem de não usados
        const sectionCResponses = responses?.sectionC?.[qId];
        const percentages = calculateStatusPercentages(sectionCResponses, totalBehaviors);
        labels.push(qId);
        emergentPercentages.push(percentages.emergent);
        masteredPercentages.push(percentages.mastered);
        notUsedPercentages.push(percentages.notUsed);
    });

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Dominado',
                data: masteredPercentages,
                backgroundColor: backgroundColors['mastered'],
                borderColor: borderColors['mastered'],
                borderWidth: 1,
            },
            {
                label: 'Emergente',
                data: emergentPercentages,
                backgroundColor: backgroundColors['emergent'],
                borderColor: borderColors['emergent'],
                borderWidth: 1,
            },
            {
                label: 'Não Usado/Não Respondido',
                data: notUsedPercentages,
                backgroundColor: backgroundColors['not-used'],
                borderColor: borderColors['not-used'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Percentual de Status por Pergunta (Seção/Nível)',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.raw.toFixed(1) + '%'; // Mostra o percentual com 1 casa decimal
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Pergunta (Seção.Número)'
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                max: 100, // Eixo Y vai até 100%
                title: {
                    display: true,
                    text: 'Percentual'
                },
                ticks: {
                    callback: function (value: any) {
                        return value + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Percentual de Status por Pergunta</h2>
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default AssessmentBarChart;