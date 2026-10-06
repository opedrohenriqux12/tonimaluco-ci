import { generateWithGemini, GEMINI_MODEL } from '../src/lib/council/gemini';
import { runIndividualTurn, runGroupTurn, type RoomMessage } from '../src/lib/council/orchestrator';

// Script para executar a suíte de 10 testes de aceitação localmente contra as rotas ou chamando o módulo.
// Executar com: npx tsx test-suite.ts
async function runTestSuite() {
  console.log('--- TEST SUITE DE ACEITAÇÃO DO CONSELHO ---');
  console.log(`Usando modelo Gemini: ${GEMINI_MODEL}`);
  
  // Testes simulados
  console.log('\n[1/10] Individual, Helena: "Oi, tudo bem?"');
  // ...
}

runTestSuite();
