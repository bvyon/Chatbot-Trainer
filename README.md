# 🤖 BizBot AI - Neural Knowledge Manager

**BizBot AI** es una plataforma avanzada de gestión de conocimiento para chatbots, diseñada para transformar documentos estáticos (PDF) en un "Cerebro Digital" portátil y altamente eficiente. Utiliza técnicas de **RAG (Retrieval-Augmented Generation)** para permitir que modelos de IA como Gemini y GPT-4 respondan basándose exclusivamente en tu información empresarial.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![AI](https://img.shields.io/badge/Powered%20by-Gemini%202.5-emerald?logo=google-gemini)

---

## 🚀 Características Principales

- **📂 Entrenamiento Basado en Documentos:** Ingesta de archivos PDF con procesamiento local. El sistema limpia, segmenta y prepara el texto automáticamente.
- **🧠 Motor Neuronal (RAG):** Simulación de base de datos vectorial en tiempo real que permite al chatbot consultar fragmentos específicos de información para dar respuestas precisas.
- **🔌 Multi-Proveedor de IA:** Soporte nativo para:
  - **Google Gemini** (Optimizado para contextos grandes).
  - **OpenAI** (Estándar de la industria).
  - **OpenRouter** (Acceso a Llama 3, Mistral, Claude, etc.).
- **📦 Exportación de "Cerebro" (JSON):** Función única para descargar toda la base de conocimiento procesada en un formato `brain_config.json`, lista para ser integrada en scripts de Python, aplicaciones de WhatsApp Business o sistemas propietarios.
- **🧪 Chat de Pruebas:** Interfaz interactiva para validar el comportamiento del bot antes de su despliegue.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19 + TypeScript.
- **Estilos:** Tailwind CSS con animaciones personalizadas.
- **Procesamiento de PDF:** PDF.js (Client-side parsing).
- **IA:** Google GenAI SDK (@google/genai).
- **Iconografía:** Lucide React.

---

## 📥 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/bizbot-ai.git
   cd bizbot-ai

Instalar dependencias:
code
Bash
npm install
Variables de Entorno:
Crea un archivo .env o configura las variables en tu entorno de despliegue:
code
Env
API_KEY=tu_gemini_api_key_aqui
Ejecutar en desarrollo:
code
Bash
npm run dev
💡 Flujo de Trabajo: Del PDF al Multicanal
BizBot AI no es solo un chatbot, es una herramienta de preparación de datos:
Entrenamiento: Sube tus manuales, catálogos o FAQs en la pestaña "Entrenamiento PDF".
Validación: Usa el "Test Chatbot" para asegurar que la IA responde correctamente usando el contexto.
Exportación: Haz clic en "Exportar Cerebro (JSON)".
Portabilidad: Usa el archivo generado para alimentar tus propios desarrollos en Python:
code
Python
import json

# Cargar el cerebro de BizBot
with open('brain_config.json', 'r') as f:
    brain = json.load(f)

# El conocimiento ya está dividido en 'chunks' listos para tu base de datos vectorial
for source in brain['knowledgeBase']:
    for node in source['chunks']:
        print(f"ID: {node['id']} | Contenido: {node['text'][:50]}...")
📁 Estructura del Archivo brain_config.json
El archivo exportado sigue este esquema:
project: Nombre del proyecto.
totalChunks: Cantidad total de nodos de conocimiento.
knowledgeBase: Lista de archivos procesados.
fileName: Nombre del original.
fullText: Texto completo extraído.
chunks: Lista de fragmentos optimizados con text e id.
📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
🤝 Contribuciones
¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el motor RAG o añadir más proveedores de IA, no dudes en abrir un PR o un Issue.
Desarrollado con ❤️ para la comunidad de IA.
code
Code
### Consejos adicionales para tu repo:
1. **Añade capturas de pantalla:** Los GIFs o imágenes del Dashboard y del Training Panel ayudan muchísimo a que la gente entienda la potencia visual de tu app.
2. **Personaliza el enlace:** Si tienes la app desplegada (en Vercel, Netlify, etc.), pon el link en la descripción del repositorio de GitHub.
3. **Keywords:** Añade etiquetas a tu repo como `RAG`, `Gemini`, `Chatbot`, `Python-ready`.
