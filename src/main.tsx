import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "./tambo-components";

import 'tui-image-editor/dist/tui-image-editor.css';
import "tui-color-picker/dist/tui-color-picker.css";
import "tui-image-editor/dist/svg/icon-a.svg";
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <TamboProvider 
    apiKey={import.meta.env.VITE_TAMBO_API_KEY}
    components={tamboComponents}
    >
    <App />
    </TamboProvider> 
)
