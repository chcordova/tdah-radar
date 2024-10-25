
# Especificación Técnica: Modelo de Clasificación para Detección de TDAH

## 1. Introducción

Este documento técnico describe la implementación de un modelo de regresión logística para la detección de síntomas de TDAH en niños, basado en un formulario de respuestas con escala de Likert. Este sistema está desarrollado en **Python**, usando librerías de **machine learning** y procesamiento de datos. Además, se incluye un servicio web para la integración del modelo con otros sistemas.

### Objetivo

El objetivo principal de este sistema es ofrecer una herramienta automatizada para el diagnóstico preliminar de TDAH mediante un modelo de clasificación, disponible para consumo mediante una API REST. Este modelo clasifica respuestas en escala de Likert para identificar patrones de comportamiento asociados con TDAH y devuelve un diagnóstico en formato binario (`0` para ausencia de TDAH, `1` para posible TDAH).

---

## 2. Lenguaje y Librerías Utilizadas

- **Lenguaje**: Python 3.x
- **Librerías principales**:
  - **Scikit-Learn (`sklearn`)**: Utilizada para la implementación del modelo de regresión logística y la preprocesamiento de datos.
  - **NumPy**: Para manipulación de arrays y procesamiento de datos.
  - **Joblib**: Para guardar y cargar el modelo de machine learning una vez entrenado.
  - **Flask**: Framework para crear el servicio web que expone el modelo como API.

---

## 3. Descripción de los Scripts y Funcionalidades

### 3.1 Entrenamiento del Modelo y Guardado (`entrenamiento_modelo.py`)

#### Descripción
Este script entrena un modelo de regresión logística utilizando datos de entrenamiento generados. Al finalizar el entrenamiento, el modelo se guarda en formato `.pkl` para su uso en el servicio de diagnóstico.

#### Objetivo
Entrenar un modelo de clasificación binaria que pueda distinguir entre casos de TDAH y no-TDAH basándose en las respuestas del cuestionario.

#### Código del Script
```python
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import numpy as np

# Suponiendo que los datos de entrenamiento estén en X (respuestas) y y (diagnóstico)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Escalado de características
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Entrenar el modelo
model = LogisticRegression()
model.fit(X_train, y_train)

# Guardar el modelo
joblib.dump(model, 'modelo_tdah.pkl')
```

#### Inputs
- `X`: Matriz de respuestas en escala Likert (formato array, tamaño `[n_samples, n_features]`).
- `y`: Etiquetas binarias para el diagnóstico de TDAH (`0` o `1`).

#### Outputs
- Archivo `modelo_tdah.pkl`: Contiene el modelo entrenado, listo para ser cargado en el servicio de diagnóstico.

---

### 3.2 Función de Diagnóstico (`funcion_diagnostico.py`)

#### Descripción
Esta función carga el modelo entrenado y lo usa para clasificar nuevas respuestas del cuestionario, retornando `0` o `1` como diagnóstico.

#### Objetivo
Proporcionar una función reutilizable para hacer predicciones a partir de un modelo ya entrenado, lo cual facilitará la implementación del servicio web.

#### Código del Script
```python
import joblib
import numpy as np

# Cargar el modelo
modelo = joblib.load('modelo_tdah.pkl')

def diagnosticar_tdah(respuestas):
    """
    Diagnostica TDAH en base a las respuestas del formulario.
    
    Args:
    respuestas (list): Lista de respuestas en escala Likert de 1 a 4.
    
    Returns:
    int: 0 si el modelo predice 'sin TDAH', 1 si predice 'con TDAH'.
    """
    respuestas = np.array(respuestas).reshape(1, -1)
    prediccion = modelo.predict(respuestas)
    return int(prediccion[0])
```

#### Inputs
- `respuestas`: Lista de valores de respuestas (escala Likert de `1` a `4`) que representan las respuestas de una persona (formato array, tamaño `[1, n_features]`).

#### Outputs
- Diagnóstico (int): `0` o `1`, donde `0` indica que no hay TDAH y `1` sugiere la posibilidad de TDAH.

---

### 3.3 Servicio Web de Diagnóstico (`servicio_web.py`)

#### Descripción
Este script utiliza **Flask** para implementar un servicio web que permita a otros sistemas enviar respuestas del cuestionario y recibir el diagnóstico como respuesta.

#### Objetivo
Facilitar la integración del modelo de detección de TDAH con otros sistemas mediante una API REST, que expone el diagnóstico como un servicio accesible mediante HTTP.

#### Código del Script
```python
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Cargar el modelo entrenado
modelo = joblib.load('modelo_tdah.pkl')

@app.route('/diagnostico', methods=['POST'])
def diagnostico():
    datos = request.get_json()
    respuestas = datos['respuestas']
    respuestas = np.array(respuestas).reshape(1, -1)
    prediccion = modelo.predict(respuestas)
    resultado = int(prediccion[0])
    return jsonify({"diagnostico": resultado})

if __name__ == '__main__':
    app.run(debug=True)
```

#### Inputs
- **Método HTTP POST** en `/diagnostico`
- **JSON** con el campo `respuestas` (ejemplo): 
  ```json
  {
    "respuestas": [2, 3, 4, 1, 2]
  }
  ```

#### Outputs
- **JSON** con el diagnóstico en el campo `diagnostico`:
  ```json
  {
    "diagnostico": 1
  }
  ```

---

## 4. Flujo de Datos

1. **Entrenamiento del modelo** (`entrenamiento_modelo.py`):
   - Entrena y guarda el modelo de regresión logística en un archivo para su posterior uso.
2. **Función de diagnóstico** (`funcion_diagnostico.py`):
   - Proporciona una función reutilizable para cargar el modelo y predecir el diagnóstico.
3. **Servicio Web** (`servicio_web.py`):
   - Implementa una API REST para exponer el modelo como servicio HTTP, permitiendo a otros sistemas enviar datos y recibir un diagnóstico.

---
Este esquema detalla los elementos clave del sistema de detección de TDAH y proporciona una visión clara de su funcionamiento.
