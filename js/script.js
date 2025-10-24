document.addEventListener('DOMContentLoaded', function() {
            
            // --- Seleção de Elementos ---
            const form = document.getElementById('imc-form');
            const nomeInput = document.getElementById('nome');
            const alturaInput = document.getElementById('altura');
            const pesoInput = document.getElementById('peso');
            
            // Elementos da área de resultado
            const resultContainer = document.getElementById('result-container');
            const resultPlaceholder = document.getElementById('result-placeholder');
            const resultData = document.getElementById('result-data');
            const resultError = document.getElementById('result-error');
            
            // Elementos de texto do resultado
            const resultNameEl = document.getElementById('result-name');
            const resultImcEl = document.getElementById('result-imc');
            const resultClassificationEl = document.getElementById('result-classification');
            const errorMsgEl = document.getElementById('error-message');

            // --- Event Listener Principal ---
            form.addEventListener('submit', function(event) {
                // Impede o recarregamento da página
                event.preventDefault();

                // 1. Obter e Tratar os Valores
                const nome = nomeInput.value;
                // Substitui vírgula por ponto para consistência
                const alturaVal = alturaInput.value.replace(',', '.');
                const pesoVal = pesoInput.value.replace(',', '.');

                const altura = parseFloat(alturaVal);
                const peso = parseFloat(pesoVal);

                // 2. Validar Entradas
                if (!nome || !alturaVal || !pesoVal) {
                    showError('Por favor, preencha todos os campos.');
                    return;
                }
                
                if (isNaN(altura) || isNaN(peso) || altura <= 0 || peso <= 0) {
                    showError('Altura e peso devem ser números positivos.');
                    return;
                }

                // Validação extra: impede alturas irreais (ex: 175m)
                if (altura > 3) {
                    showError('Altura improvável. Use metros (ex: 1.75).');
                    return;
                }

                // 3. Calcular o IMC
                const imc = peso / (altura * altura);
                
                // 4. Classificar o Resultado
                let classification = '';
                let classificationText = '';
                let colorClass = ''; // Classe de cor do Tailwind

                if (imc < 18.5) {
                    classification = 'baixo';
                    classificationText = 'Abaixo do Peso';
                    colorClass = 'text-yellow-400';
                } else if (imc < 25) {
                    classification = 'normal';
                    classificationText = 'Peso Ideal';
                    colorClass = 'text-green-400';
                } else if (imc < 30) {
                    classification = 'sobrepeso';
                    classificationText = 'Sobrepeso';
                    colorClass = 'text-orange-400';
                } else {
                    classification = 'obeso';
                    classificationText = 'Obesidade';
                    colorClass = 'text-red-400';
                }

                // 5. Exibir o Sucesso
                showSuccess({
                    name: `Olá, ${nome}!`,
                    imc: imc.toFixed(2),
                    classification: classificationText,
                    colorClass: colorClass
                });
            });

            // --- Funções Auxiliares de Exibição ---

            /**
             * Exibe a tela de sucesso com os dados do IMC.
             * @param {object} data - Dados do resultado.
             */
            function showSuccess(data) {
                // Esconde os outros estados
                resultPlaceholder.classList.add('hidden');
                resultError.classList.add('hidden');
                
                // Preenche os dados
                resultNameEl.textContent = data.name;
                resultImcEl.textContent = data.imc;
                resultClassificationEl.textContent = data.classification;

                // Reseta classes de cor antigas e aplica a nova
                const classesToRemove = ['text-yellow-400', 'text-green-400', 'text-orange-400', 'text-red-400'];
                resultImcEl.classList.remove(...classesToRemove);
                resultClassificationEl.classList.remove(...classesToRemove);
                
                resultImcEl.classList.add(data.colorClass);
                resultClassificationEl.classList.add(data.colorClass);

                // Mostra o container de dados
                resultData.classList.remove('hidden');
            }

            /**
             * Exibe uma mensagem de erro.
             * @param {string} message - A mensagem de erro.
             */
            function showError(message) {
                // Esconde os outros estados
                resultPlaceholder.classList.add('hidden');
                resultData.classList.add('hidden');
                
                // Define a mensagem e mostra o container de erro
                errorMsgEl.textContent = message;
                resultError.classList.remove('hidden');
            }

            // --- Bônus: Resetar ao digitar ---
            // Se o usuário começar a digitar novamente,
            // o resultado volta ao estado inicial.
            [nomeInput, alturaInput, pesoInput].forEach(input => {
                input.addEventListener('input', () => {
                    resultError.classList.add('hidden');
                    resultData.classList.add('hidden');
                    resultPlaceholder.classList.remove('hidden');
                    
                    // Limpa classes de cor
                    const classesToRemove = ['text-yellow-400', 'text-green-400', 'text-orange-400', 'text-red-400'];
                    resultImcEl.classList.remove(...classesToRemove);
                    resultClassificationEl.classList.remove(...classesToRemove);
                });
            });

        });