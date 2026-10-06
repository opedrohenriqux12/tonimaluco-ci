export interface AdvisorPersona {
  /** Mesmo id usado na interface (src/data/mockData.ts). */
  id: string;
  /** Nome completo, usado como rótulo na transcrição da sala. */
  name: string;
  /** Área curta, usada para o moderador ordenar quem fala primeiro. */
  area: string;
  /** Formas como o modelo pode escrever o próprio nome no início da fala (removidas na limpeza). */
  aliases: string[];
  /** Temperatura do Gemini para este conselheiro. */
  temperature: number;
  /** Bloco individual concatenado depois do prompt-base + contexto do projeto. */
  instruction: string;
}
