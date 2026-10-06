import { generateWithGemini, GEMINI_MODEL } from '@/lib/council/gemini';
import { getPersona, PERSONAS } from '@/lib/council/prompts/personas';
import { buildSystemInstruction, buildContents } from '@/lib/council/systemInstruction';
import { cleanReply, isPass } from '@/lib/council/sanitize';
import { runIndividualTurn, runGroupTurn, makeMessage, type RoomMessage } from '@/lib/council/orchestrator';

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log(`SUÍTE DE TESTES DE ACEITAÇÃO DO CONSELHO (${GEMINI_MODEL})`);
  console.log('====================================================\n');

  // Test 1
  console.log('🔹 TESTE 1: Individual, Helena: "Oi, tudo bem?"');
  {
    const persona = getPersona('helena')!;
    const sys = buildSystemInstruction({ persona, mode: 'individual', participantIds: ['helena'], mustRespond: true, round: 0 });
    const contents = buildContents([{ authorId: 'user', text: 'Oi, tudo bem?' }], 'helena', 'individual')!;
    const raw = await generateWithGemini({ systemInstruction: sys, contents, temperature: persona.temperature });
    const clean = cleanReply(raw, persona);
    console.log('   RESPOSTA:', clean);
  }

  // Test 2
  console.log('\n🔹 TESTE 2: War Room (Helena + Marina): "Há um problema"');
  {
    const h: RoomMessage[] = [makeMessage('user', 'Há um problema')];
    const res = await runGroupTurn(['helena', 'marina'], h, {
      onTyping: () => {},
      onMessage: (m) => console.log(`   [${m.authorId}]: ${m.text}`)
    });
    console.log('   RESULTADO:', res);
  }

  // Test 3
  console.log('\n🔹 TESTE 3: Helena: "Se eu compro a 100 e vendo a 125, qual minha margem?"');
  {
    const persona = getPersona('helena')!;
    const sys = buildSystemInstruction({ persona, mode: 'individual', participantIds: ['helena'], mustRespond: true, round: 0 });
    const contents = buildContents([{ authorId: 'user', text: 'Se eu compro a 100 e vendo a 125, qual minha margem?' }], 'helena', 'individual')!;
    const raw = await generateWithGemini({ systemInstruction: sys, contents, temperature: persona.temperature });
    console.log('   RESPOSTA:', cleanReply(raw, persona));
  }

  // Test 4
  console.log('\n🔹 TESTE 4: Helena: "Tô achando que vale a pena, o que você acha?"');
  {
    const persona = getPersona('helena')!;
    const sys = buildSystemInstruction({ persona, mode: 'individual', participantIds: ['helena'], mustRespond: true, round: 0 });
    const contents = buildContents([{ authorId: 'user', text: 'Tô achando que vale a pena, o que você acha?' }], 'helena', 'individual')!;
    const raw = await generateWithGemini({ systemInstruction: sys, contents, temperature: persona.temperature });
    console.log('   RESPOSTA:', cleanReply(raw, persona));
  }

  // Test 5
  console.log('\n🔹 TESTE 5: Rafael: Pergunta sobre TOS que ele não viu');
  {
    const persona = getPersona('rafael')!;
    const sys = buildSystemInstruction({ persona, mode: 'individual', participantIds: ['rafael'], mustRespond: true, round: 0 });
    const contents = buildContents([{ authorId: 'user', text: 'Dá pra vender essa conta segundo as regras do jogo?' }], 'rafael', 'individual')!;
    const raw = await generateWithGemini({ systemInstruction: sys, contents, temperature: persona.temperature });
    console.log('   RESPOSTA:', cleanReply(raw, persona));
  }

  // Test 6
  console.log('\n🔹 TESTE 6: Bruno: "Quero automatizar a entrega" com volume baixo');
  {
    const persona = getPersona('byte')!;
    const sys = buildSystemInstruction({ persona, mode: 'individual', participantIds: ['byte'], mustRespond: true, round: 0 });
    const contents = buildContents([{ authorId: 'user', text: 'Tô vendendo 2 chaves por dia e quero criar um robô pra automatizar a entrega. O que acha?' }], 'byte', 'individual')!;
    const raw = await generateWithGemini({ systemInstruction: sys, contents, temperature: persona.temperature });
    console.log('   RESPOSTA:', cleanReply(raw, persona));
  }

  // Test 7
  console.log('\n🔹 TESTE 7: Lúcia: "Todo mundo tá comprando isso, tenho que entrar agora"');
  {
    const persona = getPersona('lucia')!;
    const sys = buildSystemInstruction({ persona, mode: 'individual', participantIds: ['lucia'], mustRespond: true, round: 0 });
    const contents = buildContents([{ authorId: 'user', text: 'Todo mundo tá comprando essa skin no mercado, tenho que entrar agora antes que acabe!' }], 'lucia', 'individual')!;
    const raw = await generateWithGemini({ systemInstruction: sys, contents, temperature: persona.temperature });
    console.log('   RESPOSTA:', cleanReply(raw, persona));
  }

  // Test 8
  console.log('\n🔹 TESTE 8: Conselho completo: "Bom dia, pessoal"');
  {
    const h: RoomMessage[] = [makeMessage('user', 'Bom dia, pessoal')];
    const all = PERSONAS.map(p => p.id);
    const res = await runGroupTurn(all, h, {
      onTyping: () => {},
      onMessage: (m) => console.log(`   [${m.authorId}]: ${m.text}`)
    });
    console.log('   RESUMO:', res);
  }

  // Test 9
  console.log('\n🔹 TESTE 9: Conselho completo: "Quero revender X com markup de 30%, o que acham?"');
  {
    const h: RoomMessage[] = [makeMessage('user', 'Quero revender gift cards com markup de 30%, o que acham?')];
    const all = PERSONAS.map(p => p.id);
    const res = await runGroupTurn(all, h, {
      onTyping: () => {},
      onMessage: (m) => console.log(`   [${m.authorId}]: ${m.text}`)
    });
    console.log('   RESUMO:', res);
  }

  // Test 10
  console.log('\n🔹 TESTE 10: Pergunta fora da área para Marina: "me explica o que é uma API?"');
  {
    const persona = getPersona('marina')!;
    const sys = buildSystemInstruction({ persona, mode: 'individual', participantIds: ['marina'], mustRespond: true, round: 0 });
    const contents = buildContents([{ authorId: 'user', text: 'me explica o que é uma API?' }], 'marina', 'individual')!;
    const raw = await generateWithGemini({ systemInstruction: sys, contents, temperature: persona.temperature });
    console.log('   RESPOSTA:', cleanReply(raw, persona));
  }

  console.log('\n====================================================');
  console.log('FIM DA SUÍTE DE TESTES DE ACEITAÇÃO');
  console.log('====================================================');
}

runAcceptanceTests().catch(console.error);
