
# Firebase Realtime Database

## 1. Introducción

Firebase Realtime Database es una base de datos en tiempo real que permite el almacenamiento y sincronización de datos entre clientes y servidores. Esta tecnología está diseñada para ser escalable y accesible, lo que facilita el desarrollo de aplicaciones web y móviles que requieren actualizaciones instantáneas.

El proyecto **TDAH Radar** utiliza Firebase Realtime Database para gestionar dinámicamente un cuestionario destinado a la detección temprana de TDAH (Trastorno por Déficit de Atención e Hiperactividad). Las preguntas y respuestas del cuestionario se almacenan en un formato JSON accesible desde el siguiente endpoint:

```
https://tdah-radar-default-rtdb.firebaseio.com/questions.json
```

## 2. Arquitectura de Firebase Realtime Database

### 2.1. Estructura de Datos

Firebase Realtime Database utiliza un formato JSON para almacenar datos en una estructura jerárquica. Esto permite la recuperación y manipulación eficiente de datos. En el caso de **TDAH Radar**, el JSON contiene una serie de preguntas, cada una con sus respectivas opciones de respuesta.

#### 2.1.1. Ejemplo de Estructura JSON

A continuación se presenta un ejemplo de la estructura JSON que se encuentra en la base de datos:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "¿Con qué frecuencia tiene problemas para prestar atención?",
      "options": [
        "Nunca",
        "A veces",
        "Frecuentemente",
        "Casi siempre"
      ]
    },
    {
      "id": 2,
      "question": "¿Se distrae fácilmente con estímulos externos?",
      "options": [
        "Nunca",
        "A veces",
        "Frecuentemente",
        "Casi siempre"
      ]
    }
    // ...más preguntas
  ]
}
```

### 2.2. Acceso a la Base de Datos

Los datos en Firebase Realtime Database pueden ser accedidos y manipulados mediante diversas bibliotecas y SDKs que ofrecen Firebase. Esto permite que desarrolladores de diferentes entornos integren y utilicen los datos de manera efectiva.

## 3. Ejemplos de Acceso a Firebase Realtime Database

A continuación se presentan ejemplos de cómo acceder a la base de datos en diferentes lenguajes de programación:

### 3.1. JavaScript

```javascript
// Firebase init
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://tdah-radar-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const questionsRef = ref(db, 'questions');

get(questionsRef).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
```

### 3.2. Java

```java
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class FirebaseExample {
    public static void main(String[] args) {
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference ref = database.getReference("questions");

        ref.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // Obtener datos
                System.out.println(dataSnapshot.getValue());
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                System.err.println("Error: " + databaseError.getMessage());
            }
        });
    }
}
```

### 3.3. Python

```python
import requests

url = "https://tdah-radar-default-rtdb.firebaseio.com/questions.json"
response = requests.get(url)

if response.status_code == 200:
    questions = response.json()
    print(questions)
else:
    print("Error:", response.status_code)
```

### 3.4. Flutter (Dart)

```dart
import 'package:firebase_database/firebase_database.dart';

void main() {
  final databaseReference = FirebaseDatabase.instance.reference();

  databaseReference.child('questions').once().then((DataSnapshot snapshot) {
    print('Data : ${snapshot.value}');
  });
}
```

## 4. Conclusiones

Firebase Realtime Database proporciona una solución efectiva y escalable para la gestión de datos en tiempo real en aplicaciones web y móviles. Su estructura JSON y su capacidad para sincronizar datos en tiempo real hacen que sea una opción ideal para proyectos como TDAH Radar, donde las preguntas del cuestionario son dinámicas y necesitan ser accesibles instantáneamente.
