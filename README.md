# 🤖 BizBot AI - Neural Knowledge Manager

**BizBot AI** es una plataforma de gestión de conocimiento diseñada para transformar documentos PDF estáticos en un **"Cerebro Digital"** portátil y altamente eficiente. Utiliza técnicas de **RAG (Retrieval-Augmented Generation)** para permitir que modelos de IA como Gemini y GPT-4 respondan basándose exclusivamente en tu información corporativa.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![AI](https://img.shields.io/badge/Powered%20by-Gemini%203%20Flash-emerald?logo=google-gemini)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

---

## 🚀 Características Principales

- **📂 Ingesta de Datos (PDF):** Procesamiento local de documentos con limpieza y segmentación automática de texto.
- **🧠 Motor RAG Local:** Simulación de base de datos vectorial que permite al chatbot consultar fragmentos específicos de información en milisegundos.
- **🔌 Multi-Proveedor:** Soporte nativo para Google Gemini (Optimizado), OpenAI y OpenRouter.
- **📦 Exportación "Neural Brain" (JSON):** Descarga toda la base de conocimiento procesada en un formato estandarizado para portarla a cualquier canal (WhatsApp Business, Telegram, Python, etc.).
- **🧪 Sandbox de Chat:** Interfaz para validar el comportamiento del bot y la precisión de sus respuestas.

---

## 🛠️ Guía Paso a Paso

### 1. Configuración Inicial
Antes de comenzar, asegúrate de configurar tu motor de IA preferido:
- Dirígete a la pestaña **Configuración**.
- Selecciona **Google Gemini** (Recomendado por su ventana de contexto masiva).
- Si usas OpenAI o OpenRouter, ingresa tu API Key personal.

### 2. Entrenamiento del Cerebro
Transforma tus documentos en conocimiento:
- Ve a la sección **Entrenamiento & Exportación**.
- Arrastra tus archivos PDF (Manuales, FAQs, Catálogos).
- El sistema dividirá el texto en "Nodos de Conocimiento" (Chunks). Podrás ver la visualización técnica de estos nodos en el panel derecho.

### 3. Prueba y Validación
Asegúrate de que la IA entiende tu negocio:
- Abre el **Test Chatbot**.
- Haz preguntas específicas contenidas en tus PDFs.
- El bot recuperará automáticamente los fragmentos más relevantes para responder con precisión quirúrgica.

### 4. Exportación Multicanal
Lleva tu IA a donde están tus clientes:
- Una vez procesados los archivos, haz clic en **Exportar Cerebro (JSON)**.
- Se descargará un archivo `bizbot-brain-config-xxx.json` que contiene el conocimiento "masticado" y listo para ser usado por otros sistemas.

---

## 💡 Ejemplos de Integración (Python)

El archivo JSON exportado es la clave para la portabilidad. Aquí tienes un ejemplo de cómo usarlo en un script de Python para alimentar un bot de WhatsApp o Telegram:

```python
import json

# Cargar el cerebro generado por BizBot AI
with open('bizbot-brain-config.json', 'r', encoding='utf-8') as f:
    brain_data = json.load(f)

# Función simple de búsqueda por palabras clave (Simulación de RAG)
def find_relevant_context(query, brain):
    query = query.lower()
    relevant_chunks = []
    
    for doc in brain['knowledgeBase']:
        for chunk in doc['chunks']:
            if any(word in chunk['text'].lower() for word in query.split()):
                relevant_chunks.append(chunk['text'])
    
    return "\n".join(relevant_chunks[:3])

# Ejemplo de uso
user_query = "¿Cuál es el horario de atención?"
context = find_relevant_context(user_query, brain_data)

# El 'context' se envía al prompt de Gemini/GPT como sistema de referencia
prompt = f"Contesta esta pregunta: {user_query}\n\nUsando este contexto:\n{context}"
print(f"Prompt para la IA:\n{prompt}")
```

---

## 📊 Estructura del `brain_config.json`

El archivo exportado sigue esta jerarquía técnica:

```json
{
  "project": "BizBot AI - Neural Brain",
  "exportDate": "2023-10-27T...",
  "knowledgeBase": [
    {
      "fileName": "manual_v1.pdf",
      "fullText": "...",
      "chunks": [
        {
          "id": "file-chunk-0",
          "text": "Contenido del fragmento 1...",
          "tokens": 125
        }
      ]
    }
  ]
}
```

---

## 🔧 Instalación y Desarrollo Local

1. **Clonar Repo:** `git clone https://github.com/tu-usuario/bizbot-ai.git`
2. **Instalar:** `npm install`
3. **Ejecutar:** `npm run dev`

*Requiere una API Key de Gemini configurada en el entorno (`process.env.API_KEY`) o mediante la interfaz de ajustes.*

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo, modificarlo y compartirlo.

---
Desarrollado con ❤️ por ingenieros para el futuro de la IA conversacional.