// script.js
$(document).ready(function () {
    // 1. Realizamos la solicitud para obtener las preguntas
    $.ajax({
        url: 'https://tdah-radar-default-rtdb.firebaseio.com/questions.json',
        method: 'GET',
        success: function (data) {
            renderQuestions(data);
        }
    });

    // 2. Función para renderizar las preguntas en la interfaz
    function renderQuestions(data) {
        let questionnaire = $('#questionnaire');
        $.each(data, function (key, question) {
            let questionHtml = `<div class="question card-panel purple lighten-5">
                    <p>
                        <label>${question.label}</label>
                    </p>`;
            $.each(question.answers, function (aKey, answer) {
                questionHtml += `
                        <p>
                            <label>
                                <input name="${question.id}" type="radio" value="${answer.value}" />
                                <span>${answer.label}</span>
                            </label>
                        </p>`;
            });
            questionHtml += '</div>';
            questionnaire.append(questionHtml);
        });
    }

    // 3. Enviar respuestas a TensorFlow y mostrar resultado
    $('#submitBtn').click(function (event) {
        event.preventDefault();  // Evitar el envío automático del formulario
        let responses = {};

        // Recolectar respuestas seleccionadas
        $('#questionnaire input:checked').each(function () {
            responses[$(this).attr('name')] = parseInt($(this).val());
        });

        // Enviar las respuestas para predicción
        $.ajax({
            url: '/predict',  // Enlace al servidor de TensorFlow
            method: 'POST',
            data: JSON.stringify(responses),
            contentType: 'application/json',
            success: function (result) {
                $('#result').html(`Resultado del análisis: ${result.prediction}`);
            }
        });
    });
});
