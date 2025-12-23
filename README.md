# 🤖 BizBot AI - Neural Knowledge Manager

**BizBot AI** es una plataforma de gestión de conocimiento diseñada para transformar documentos PDF en un "Cerebro Digital" portátil. Utiliza **RAG (Retrieval-Augmented Generation)** para permitir que modelos de IA como Gemini respondan basándose exclusivamente en tu información empresarial.

## 🚀 Características Principales

- **📂 Entrenamiento PDF:** Procesa documentos locales, los limpia y los fragmenta en nodos semánticos.
- **🧠 Motor Neuronal (RAG):** Simulación de base de datos vectorial en tiempo real para consultas precisas.
- **🔌 Multi-Proveedor:** Soporte nativo para Google Gemini, OpenAI y OpenRouter.
- **📦 Exportación de Cerebro (JSON):** Función única para descargar `brain_config.json`, permitiendo portar el entrenamiento a Python, WhatsApp Business API real, Telegram o cualquier otro canal.

## 💡 Cómo usar el `brain_config.json` en Python

El archivo exportado contiene el conocimiento ya procesado. Aquí un ejemplo de cómo cargarlo en tus scripts:

```python
import json

# 1. Cargar el cerebro exportado
with open('bizbot-brain-config.json', 'r', encoding='utf-8') as f:
    brain_data = json.load(f)

# 2. Ejemplo de acceso a los nodos de conocimiento
for doc in brain_data['knowledgeBase']:
    print(f"Fuente: {doc['fileName']}")
    for chunk in doc['chunks']:
        # Estos fragmentos están listos para ser enviados a tu modelo de IA
        print(f"Texto procesado: {chunk['text'][:50]}...")
```

## 🛠️ Instalación

1. Clona el repositorio.
2. Instala dependencias con `npm install`.
3. Ejecuta con `npm run dev`.

*Nota: Requiere una API Key de Google Gemini o el proveedor de tu elección configurada en la pestaña de ajustes.*

---
Desarrollado para la democratización del entrenamiento de IA personalizada.