// Gemini API Client & Local Rule-Based Metaphysics Fallback
// This file connects the Qi Men Dun Jia engine to Gemini AI, allowing users to ask questions.
// It supports direct HTTP fetch to Google Gemini API or uses an advanced localized mock engine as a fallback.

/**
 * Sends a chat query to Gemini AI or falls back to our local Astrology Intelligence engine.
 * 
 * @param {Object} chart Current calculated Qi Men chart
 * @param {Object} userInfo User personal information (birth date, gender, focus)
 * @param {Array} chatHistory Array of past messages: [{ sender: 'user'|'ai', text: string }]
 * @param {string} userApiKey User-provided Gemini API Key (optional)
 * @returns {Promise<string>} Response from the AI Celestial Mentor
 */
export async function askCelestialMentor(chart, userInfo, chatHistory, userApiKey) {
  const latestMessage = chatHistory[chatHistory.length - 1]?.text || '';
  
  // 1. If an API key is provided, attempt to call the real Gemini API
  if (userApiKey && userApiKey.trim() !== '') {
    try {
      const response = await callGeminiAPI(chart, userInfo, chatHistory, userApiKey);
      if (response) return response;
    } catch (err) {
      console.error('Failed to call real Gemini API, falling back to local oracle:', err);
      // Fallback below
    }
  }
  
  // 2. Local Fallback - Generates highly authentic, responsive astrological answers
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateLocalOracleResponse(chart, userInfo, latestMessage, chatHistory));
    }, 1500); // simulation delay for realism
  });
}

// --- CALL REAL GEMINI API ---
async function callGeminiAPI(chart, userInfo, chatHistory, apiKey) {
  // Construct the prompt detailing the complete Qi Men Dun Jia chart state
  const prompt = constructSystemPrompt(chart, userInfo, chatHistory);
  
  // Formulate chat context
  const contents = [];
  
  // Add history (Gemini format: role 'user' or 'model')
  // We can include a system prompt at the beginning or as systemInstruction
  // To keep it simple, we prepend the context to the conversation
  
  const historyContents = chatHistory.slice(0, -1).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: `${prompt}\n\n用户当前提问：${chatHistory[chatHistory.length - 1]?.text}` }]
  });
  
  const payload = {
    contents: [...historyContents, ...contents],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  };
  
  // Call Gemini 2.5 Flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'API Call failed');
  }
  
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// --- SYSTEM PROMPT CONSTRUCTOR ---
function constructSystemPrompt(chart, userInfo, chatHistory) {
  const { pillars, ju, board } = chart;
  
  // Format palaces data
  let palacesStr = '';
  for (let p = 1; p <= 9; p++) {
    const c = board[p];
    palacesStr += `宫位${p}(${c.info.direction}${c.info.name}, 属${c.info.element}): 神【${c.deity}】, 星【${c.star}】, 门【${c.door}】, 天盘干【${c.tianPan}】, 地盘干【${c.diPan}】${c.isEmpty ? ' (空亡)' : ''}\n`;
  }
  
  return `你是一位精通中国传统易经卜筮与奇门遁甲（时家奇门）的AI仙师、东方哲学智者。
你的说话风格：冷静、高深、玄妙、温和、字字珠玑，使用文白相间的语言，但给出的建议要极具现代实操性和心理疏导价值。

当前预测对象个人信息：
- 姓名/代称：${userInfo.name || '有缘人'}
- 性别：${userInfo.gender || '未知'}
- 出生日期：${userInfo.birthDate} ${userInfo.birthHour || '12'}点
- 命理干支（求测者八字推算）：年柱【${getYearGanzhi(new Date(userInfo.birthDate).getFullYear())}】、日柱【${getDayGanzhi(new Date(userInfo.birthDate))}】
- 当前关注领域：${userInfo.focus === 'career' ? '事业与前途' : userInfo.focus === 'wealth' ? '财运与投资' : userInfo.focus === 'love' ? '婚姻情感' : '综合运势'}

当前起卦时空与奇门局象：
- 起局时间：${new Date(chart.date).toLocaleString('zh-CN')}
- 四柱干支：${pillars.year}年 ${pillars.month}月 ${pillars.day}日 ${pillars.hour}时
- 奇门局数：${ju.name}，旬首：${ju.xun} (值符星：${ju.zhiFuStar}，值使门：${ju.zhiShiDoor})
- 九宫全盘分布：
${palacesStr}

解盘核心规则（请在回答中融合这些规则，但不要死板地罗列）：
1. 问事业：主看开门所在的宫位，以及值符、日干与时干的生克关系。
2. 问财运：主看生门（代表利润）和戊奇（代表资本）所在的宫位。
3. 问感情：主看六合（代表婚姻合作）、乙奇（代表女方）、庚金（代表男方）所在的宫位。
4. 问健康：主看天芮星（代表病灶）和死门所在的宫位。
5. 旬空：如果相关要素落入旬空宫位，代表能量落空、变动、虚无，主事有转折或需等待出空。

请根据用户的提问，结合上述奇门局象与求测者的信息，提供深度专业的分析：
1. 详析当前局势的吉凶（点出起决定作用的吉神、吉门或克制关系）。
2. 从奇门九宫中指出一个最适合采取行动或避难的“吉利方位/策略”。
3. 给出切实的建议和未来趋势安排。

请直接以仙师口吻开始作答，字数控制在300-500字。`;
}

// Helper to determine year and day Ganzhi in prompt
function getYearGanzhi(year) {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  let idx = (16 + (year - 2000)) % 60;
  if (idx < 0) idx += 60;
  return stems[idx % 10] + branches[idx % 12];
}

function getDayGanzhi(date) {
  const refDate = new Date(2000, 0, 1);
  const diffTime = date.getTime() - refDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let idx = (54 + diffDays) % 60;
  if (idx < 0) idx += 60;
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return stems[idx % 10] + branches[idx % 12];
}

// --- LOCAL METAPHYSICS ORACLE ENGINE (SOPHISTICATED MOCK) ---
function generateLocalOracleResponse(chart, userInfo, message, chatHistory) {
  const msg = message.toLowerCase();
  const focus = userInfo.focus || 'general';
  const name = userInfo.name || '有缘人';
  
  // Extract specific features from chart
  const board = chart.board;
  
  // Find key palaces
  let kaiPalace = 6; // default Qian
  let shengPalace = 8; // default Gen
  let liuhePalace = 4; // default Xun
  let tianruiPalace = 2; // default Kun
  
  for (let p = 1; p <= 9; p++) {
    if (board[p].door === '开门') kaiPalace = p;
    if (board[p].door === '生门') shengPalace = p;
    if (board[p].deity === '六合') liuhePalace = p;
    if (board[p].star === '天芮') tianruiPalace = p;
  }
  
  const userBirthDate = new Date(userInfo.birthDate || '1995-01-01');
  const userStem = getDayGanzhi(userBirthDate)[0];
  
  // Find where user's birth stem resides on Di Pan or Tian Pan
  let userPalace = 1;
  for (let p = 1; p <= 9; p++) {
    if (board[p].tianPan === userStem || board[p].diPan === userStem) {
      userPalace = p;
      break;
    }
  }

  // Generate reply according to question intent
  let response = '';
  
  const greetings = [
    '你好', '哈罗', '在吗', '起卦', '占卜', '算命', '求测'
  ];
  const isGreeting = greetings.some(g => msg.includes(g)) || chatHistory.length === 1;
  
  if (isGreeting) {
    response = `乾坤运转，道法自然。${name}，老夫已为你布下【${chart.ju.name}】奇门局。
    
你出生之日天干为【${userStem}】，当前命盘中，你的本命落于【${board[userPalace].info.name}】（${board[userPalace].info.direction}方）。此处逢【${board[userPalace].deity}】神星当值。

今日你想求测哪方面的气场？是关于**事业晋升（开门）**、**财富营生（生门）**、还是**情感和合（六合）**？你可直接写下你的困惑，老夫为你拆解神机。`;
    return response;
  }
  
  // Topic matching
  if (msg.includes('工作') || msg.includes('事业') || msg.includes('开门') || msg.includes('换工作') || msg.includes('跳槽') || focus === 'career') {
    const palace = board[kaiPalace];
    const userFocusRelation = getElementRelation(board[userPalace].info.element, palace.info.element);
    
    response = `关于你的事业行运，老夫特为你勘测【开门】落宫。目前开门落于【${palace.info.name}】（${palace.info.direction}，五行属${palace.info.element}）。
    
开门处有吉神【${palace.deity}】与九星【${palace.star}】同宫。
${palace.isEmpty ? '【注意】此宫位目前正值“旬空”，意味着事业能量在短期内有些虚浮不实，容易出现计划延期、口头承诺无法兑现的情况。宜静观其变，待出空之后再作大动。' : '目前此方位气场充盈，利于事业开拓。'}

从五行克应来看，你的本命宫位五行（${board[userPalace].info.element}）与开门宫位五行（${palace.info.element}）呈【${userFocusRelation}】状态。
- **神机妙算**：${userFocusRelation === '相生' ? '大吉！事业气场生助本命，预示着有贵人相帮，或者你当前所处的平台能给你带来很好的滋养，可大胆施展才华。' : userFocusRelation === '相克' ? '有所克制。意味着你当前感到工作压力较大，或者现有的管理体制对你有所掣肘。此时切忌正面顶撞，宜用“太阴”或“六合”等柔性手段化解阻力。' : '比和之象。代表你与当前环境齐心协力，运势中平，适合稳步跟进既定业务。'}

- **吉利指南**：近期若需要进行关键的商务谈判或投递简历，可在【${palace.info.direction}】方位寻找契机，或者在每日的【${chart.ju.number % 2 === 0 ? '午时（11-13点）' : '申时（15-17点）'}】行动，能获得极佳的磁场加持。`;
  }
  else if (msg.includes('钱') || msg.includes('财') || msg.includes('投资') || msg.includes('生门') || msg.includes('创业') || focus === 'wealth') {
    const palace = board[shengPalace];
    const userFocusRelation = getElementRelation(board[userPalace].info.element, palace.info.element);
    
    response = `求财之道，重在顺应生机。在你的奇门盘中，代表利润和生意的【生门】落于【${palace.info.name}】（${palace.info.direction}，五行属${palace.info.element}）。
    
生门宫内组合为：【${palace.deity}】值守，【${palace.star}】星临宫，天盘干为【${palace.tianPan}】，地盘干为【${palace.diPan}】。
${palace.isEmpty ? '【注意】生门宫遭遇旬空，预示着你目前想做的投资或者求财项目有“空欢喜”或“资金被套”的风险，切忌盲目跟风做大额开销。' : '生门气场畅通，利于商业买卖、土地营建和求取利润。'}

- **财气剖析**：你的本命（五行${board[userPalace].info.element}）与生门宫（五行${palace.info.element}）呈【${userFocusRelation}】。
- **仙人指路**：${userFocusRelation === '相生' ? '财来找我，生生不息。你的财富磁场正在上升，利于主动出击。如果进行商务合作、或者发售新产品，可重点往【' + palace.info.direction + '】方向寻找资源。' : userFocusRelation === '相克' ? '求财辛苦，有“克财”或“被财累”之象。说明你需要付出极大的体力和精力才能拿到报酬。目前不宜参与高风险投资，宜积蓄资金，修剪开支。' : '财气平稳，适合多做人际链接，通过口碑介绍，以水滴石穿之势稳健获利。'}

今日财运最佳的时辰为【${chart.ju.number % 2 === 0 ? '辰时（7-9点）' : '酉时（17-19点）'}】，可在此时间段操作与资金、签约相关的事务。`;
  }
  else if (msg.includes('爱') || msg.includes('感情') || msg.includes('恋爱') || msg.includes('结婚') || msg.includes('六合') || msg.includes('脱单') || focus === 'love') {
    const palace = board[liuhePalace];
    const userFocusRelation = getElementRelation(board[userPalace].info.element, palace.info.element);
    
    response = `红尘情缘，和合交泰。当前盘中，代表婚姻、契约与情感纽带的【六合】吉神落于【${palace.info.name}】（${palace.info.direction}，五行属${palace.info.element}），配【${palace.door}】与【${palace.star}】。
    
- **姻缘推演**：你的本命宫（${board[userPalace].info.element}）与六合宫（${palace.info.element}）呈【${userFocusRelation}】状态。
- **仙师点金**：${palace.door === '死门' || palace.door === '伤门' ? '目前六合宫逢【' + palace.door + '】，说明情感沟通中存在较大的阻碍、成见或翻旧账的情况。若想关系和合，必须放下执念，主动打破僵局。' : '六合宫逢吉门，代表有沟通的桥梁。单身者近期有桃花临门之兆；已婚者则彼此信任，感情稳步提升。'}
${userFocusRelation === '相生' ? '感情运势生助本命，对方能给你很强的情感依靠或现实帮助。' : userFocusRelation === '相克' ? '在感情里你可能感到有些受制于人，或者沟通容易拧巴，宜彼此留白，以柔克刚。' : '情感磁场比和，彼此处于平等的相处状态，多一起进行户外活动可增进感情。'}

若想增进桃花或缓和关系，可多在【${palace.info.direction}】方位约会，或者在今日【${chart.ju.number % 2 === 0 ? '卯时（5-7点）' : '未时（13-15点）'}】与对方沟通，能收到较好的回应。`;
  }
  else {
    // General questions / guidance
    response = `${name}，关于你问的“${message.slice(0, 20)}${message.length > 20 ? '...' : ''}”，老夫为你总观今日起卦之奇门局象：
    
目前全局生机落于【${board[shengPalace].info.direction}】（生门）与【${board[kaiPalace].info.direction}】（开门）。你所问之事，目前核心矛盾在于【${board[tianruiPalace].info.name}】（天芮病星落宫），暗示此事正处于一个调整、需要修复漏洞的阶段。

老夫给你两个字的箴言：【**${chart.ju.number > 5 ? '沉潜' : '顺动'}**】。
${chart.ju.number > 5 ? '当前局势如同深水行舟，水流湍急且有暗礁。宜先收敛锋芒，将手头基础工作做扎实，切不可盲目做决定。' : '当前局势如同春雷初响，万物苏醒。适合做积极的主动探索，哪怕有些阻碍，只要方向正确，多能得到贵人解围。'}

你可在【${board[shengPalace].info.direction}】方位多做停留或工作，那里的气场最为温暖，能给你提供极佳的灵感与护持。`;
  }

  // Append premium notice if mock
  response += `\n\n*(提示：当前由“奇门神数”本地离线引擎为您解卦。升级为订阅用户，或在右上角设置中填写您的 Gemini API Key，即可接入最新 AI 智能大脑，实现无限深度追问与保密定制分析！)*`;

  return response;
}

// Helper: 五行生克关系
function getElementRelation(el1, el2) {
  if (el1 === el2) return '比和'; // Same
  
  // Sheng relationships: 木生火, 火生土, 土生金, 金生水, 水生木
  const sheng = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  
  // Ke relationships: 木克土, 土克水, 水克火, 火克金, 金克木
  const ke = {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  };
  
  if (sheng[el2] === el1) return '相生'; // el2 generates el1 (lucky)
  if (sheng[el1] === el2) return '相生'; // el1 generates el2 (favorable)
  if (ke[el2] === el1) return '受克'; // el2 attacks el1 (unlucky)
  if (ke[el1] === el2) return '相克'; // el1 attacks el2 (conflict)
  
  return '比和';
}
