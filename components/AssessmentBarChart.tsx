import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { Assessment } from '@/lib/utils/types';

// Registrar os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AssessmentBarChartProps {
    responses: Assessment['responses'];
}

// Estrutura que define o total POSSÍVEL de comportamentos para cada pergunta
const assessmentStructure = {
    sectionA: [
        { id: 'A.1', totalBehaviors: 5 }, // Exemplo: A.1 tem 5 comportamentos possíveis
        { id: 'A.2', totalBehaviors: 4 }, // Exemplo: A.2 tem 4 comportamentos possíveis
        { id: 'A.3', totalBehaviors: 6 }, // Exemplo: A.3 tem 6 comportamentos possíveis
    ],
    sectionB: [
        { id: 'B.1', totalBehaviors: 6 }, // B.1 tem 6 comportamentos (4 Corp, 1 Sons, 1 Fac, 1 Vis)
        { id: 'B.2', totalBehaviors: 6 }, // B.2 tem 6 comportamentos (3 Corp, 1 Sons, 1 Fac, 1 Vis)
        { id: 'B.3', totalBehaviors: 8 }, // B.3 tem 8 comportamentos (5 Corp, 1 Sons, 1 Fac, 1 Vis)
        { id: 'B.4', totalBehaviors: 7 }, // B.4 tem 7 comportamentos (4 Corp, 1 Sons, 1 Fac, 1 Vis)
    ],
    sectionC: Array.from({ length: 17 }, (_, i) => ({
        id: `C.${i + 1}`,
        totalBehaviors: 4 // Assumindo 4 comportamentos por pergunta em C para simulação
    })),
    // Adicionar outras seções (D, E, F, G) com seus IDs e totalBehaviors
};

// Helper para encontrar as informações da pergunta na estrutura
const findQuestionInfo = (qId: string) => {
    const sectionPrefix = qId.charAt(0);
    let sectionKey: keyof typeof assessmentStructure | undefined;
    if (sectionPrefix === 'A') sectionKey = 'sectionA';
    else if (sectionPrefix === 'B') sectionKey = 'sectionB';
    else if (sectionPrefix === 'C') sectionKey = 'sectionC';
    // Adicionar lógica para outras seções (D, E, F, G)

    if (!sectionKey) return null;

    return assessmentStructure[sectionKey].find(q => q.id === qId) || null;
};

export const AssessmentBarChart: React.FC<AssessmentBarChartProps> = ({ responses }) => {
    // Função auxiliar para contar os status E retornar as contagens e o total avaliado
    const countStatuses = (questionResponses: Record<string, string> | undefined): { emergent: number, mastered: number, notUsedInResponses: number, totalEvaluated: number } => {
        if (!questionResponses) {
            return { emergent: 0, mastered: 0, notUsedInResponses: 0, totalEvaluated: 0 };
        }

        let emergentCount = 0;
        let masteredCount = 0;
        let notUsedCountInResponses = 0;
        const totalEvaluatedBehaviors = Object.keys(questionResponses).length;

        Object.keys(questionResponses).forEach(behaviorKey => {
            const status = questionResponses[behaviorKey];
            if (status === 'emergent') emergentCount++;
            else if (status === 'mastered') masteredCount++;
            else if (status === 'not-used') notUsedCountInResponses++;
        });

        return { emergent: emergentCount, mastered: masteredCount, notUsedInResponses: notUsedCountInResponses, totalEvaluated: totalEvaluatedBehaviors };
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

    // Definir a ordem das seções e perguntas esperadas e iterar sobre TODAS elas
    const orderedSections: (keyof typeof assessmentStructure)[] = ['sectionA', 'sectionB', 'sectionC', /* Adicionar D, E, F, G */];

    orderedSections.forEach(sectionKey => {
        const questionsInSection = assessmentStructure[sectionKey];

        questionsInSection.forEach(questionInfo => {
            const qId = questionInfo.id;
            const totalPossibleBehaviors = questionInfo.totalBehaviors; // Ainda precisa do total possível para o tooltip
            const questionResponses = responses?.[sectionKey as keyof Assessment['responses']]?.[qId]; // Tenta obter as respostas para esta pergunta

            const totalEvaluatedBehaviors = Object.keys(questionResponses || {}).length;

            let emergentPercent = 0;
            let masteredPercent = 0;
            let notUsedPercent = 0;

            if (totalEvaluatedBehaviors > 0) {
                // Se há comportamentos avaliados, calcula percentuais sobre o total avaliado
                const statusCounts = countStatuses(questionResponses);
                emergentPercent = (statusCounts.emergent / totalEvaluatedBehaviors) * 100;
                masteredPercent = (statusCounts.mastered / totalEvaluatedBehaviors) * 100;
                notUsedPercent = (statusCounts.notUsedInResponses / totalEvaluatedBehaviors) * 100;

            } else { // totalEvaluatedBehaviors === 0
                // Se NÃO há comportamentos avaliados, 100% é "Não Usado/Não Respondido" (visualmente cinza claro)
                notUsedPercent = 100;
                // As cores padrão '#DDDDDD' serão usadas para este caso pelo dataset 'Não Usado/Não Respondido'.
            }

            labels.push(qId);
            emergentPercentages.push(emergentPercent);
            masteredPercentages.push(masteredPercent);
            notUsedPercentages.push(notUsedPercent);
        });
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
                text: 'Percentual de Status por Pergunta'
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        const percent = context.raw.toFixed(1);
                        label += percent + '%';

                        // Encontrar as informações da pergunta
                        const currentQuestionId = context.label;
                        const questionInfo = findQuestionInfo(currentQuestionId);
                        const totalPossibleBehaviors = questionInfo?.totalBehaviors || 0;

                        // Encontrar as respostas avaliadas para esta pergunta na avaliação atual
                        const sectionPrefix = currentQuestionId.charAt(0).toLowerCase();
                        let sectionKey: keyof Assessment['responses'] | undefined;
                        if (sectionPrefix === 'a') sectionKey = 'sectionA';
                        else if (sectionPrefix === 'b') sectionKey = 'sectionB';
                        else if (sectionPrefix === 'c') sectionKey = 'sectionC';
                        // Adicionar lógica para outras seções (D, E, F, G)

                        const questionResponses = sectionKey ? responses?.[sectionKey]?.[currentQuestionId] : undefined;
                        const totalEvaluatedBehaviors = Object.keys(questionResponses || {}).length;

                        // Calcular a contagem real do status para o tooltip
                        let count = 0;

                        if (context.dataset.label === 'Dominado') {
                            count = (context.raw / 100) * totalEvaluatedBehaviors; // Dominado/Emergente/Não Usado em respostas é sobre total avaliado
                        } else if (context.dataset.label === 'Emergente') {
                            count = (context.raw / 100) * totalEvaluatedBehaviors;
                        } else if (context.dataset.label === 'Não Usado/Não Respondido') {
                            // Se a pergunta NÃO foi avaliada (totalEvaluatedBehaviors === 0)
                            if (totalEvaluatedBehaviors === 0 && totalPossibleBehaviors > 0) { // Verifica totalPossibleBehaviors > 0 para evitar tooltip para perguntas sem comportamentos possíveis
                                count = totalPossibleBehaviors; // A contagem total é o total possível de comportamentos
                            } else if (totalEvaluatedBehaviors > 0) { // Se a pergunta FOI avaliada
                                count = (context.raw / 100) * totalEvaluatedBehaviors; // A contagem é o percentual exibido sobre o total avaliado
                            }
                        }

                        // Exibir a contagem real (arredondada) sobre o total apropriado
                        let totalForTooltip = totalEvaluatedBehaviors > 0 ? totalEvaluatedBehaviors : totalPossibleBehaviors;
                        if (totalForTooltip === 0) return label; // Evitar divisão por zero no tooltip se não houver totais

                        return label + ` (${Math.round(count)}/${totalForTooltip})`;
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