"use client";

import { useState } from "react";

export default function Home() {
  const [streamedData, setStreamedData] = useState("");

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setStreamedData("");

    const formData = new FormData(e.currentTarget);

    const response = await fetch("api/langchain", {
      method: "POST",
      body: JSON.stringify({
        prompt: formData.get("prompt"),
        key: formData.get("key"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const text = new TextDecoder().decode(value);
      setStreamedData((prevData) => prevData + text);
    }
  };

  const handleClearChat = () => {
    setStreamedData("");
  };

  return (
    <main className="flex max-w-6xl mx-auto items-center justify-center p-24">
      <div className="flex flex-col gap-12">
        <h1 className="text-gray-200 font-extrabold text-6xl text-center">
          SEO-AGENTE-IA-GPT🔗
        </h1>
        <h3 className="text-gray-200 font-extrabold text-2xl text-center">
          Estoy aqui para apoyarte en las tareas de un SEO
        </h3>

        <form onSubmit={handleChatSubmit}>
          <div className="flex flex-col gap-2">
            <input
              className="py-2 px-4 rounded-md bg-gray-600 text-white w-full"
              placeholder="Escribe tu pregunta"
              name="prompt"
              required
            ></input>

            <input
              className="py-2 px-4 rounded-md bg-gray-600 text-white w-full"
              name="key"
              placeholder="OpenAI API KEY (cuando refresques pagina pegar API KEY)"
              type="password"
              required
            ></input>
          </div>

          <div className="flex justify-center gap-4 py-4">
            <button
              type="submit"
              className="py-2 px-4 rounded-md text-sm bg-lime-700 text-white hover:opacity-80 transition-opacity"
            >
              Enviar Chat
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              className="py-2 px-4 rounded-md text-sm bg-red-700 text-white hover:opacity-80 transition-opacity"
            >
              Borrar Chat
            </button>
          </div>
        </form>

        {streamedData && (
          <div>
            <h3 className="text-2xl text-gray-400">AI-Respuesta</h3>
            <p className="text-gray-200 rounded-md bg-gray-700 p-4">
              {streamedData}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
