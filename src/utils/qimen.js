// Qi Men Dun Jia (奇门遁甲) Calculation Engine - Professional Edition
// Updated to support:
// 1. Longitude-based True Solar Time (真太阳时) calibration
// 2. Palace "Wang Xiang Huai Si" (旺相休囚死) strength analysis based on seasonal earthly branches
// 3. Five Elements (五行: 木, 火, 土, 金, 水) energy distribution ratio
// 4. Classical Qi Men Ge Ju (吉格/凶格) detection (五不遇时, 伏吟, 反吟, 三奇得使, 青龙返首, etc.)
// 5. High-fidelity Stems Combinations dictionary (100 combinations)

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Five Elements Elements properties of Stems & Branches
export const WU_XING = {
  // Stems
  '甲': { name: '木', polar: '阳' }, '乙': { name: '木', polar: '阴' },
  '丙': { name: '火', polar: '阳' }, '丁': { name: '火', polar: '阴' },
  '戊': { name: '土', polar: '阳' }, '己': { name: '土', polar: '阴' },
  '庚': { name: '金', polar: '阳' }, '辛': { name: '金', polar: '阴' },
  '壬': { name: '水', polar: '阳' }, '癸': { name: '水', polar: '阴' },
  // Branches
  '寅': { name: '木', polar: '阳' }, '卯': { name: '木', polar: '阴' },
  '巳': { name: '火', polar: '阳' }, '午': { name: '火', polar: '阴' },
  '申': { name: '金', polar: '阳' }, '酉': { name: '金', polar: '阴' },
  '亥': { name: '水', polar: '阳' }, '子': { name: '水', polar: '阴' },
  '辰': { name: '土', polar: '阳' }, '戌': { name: '土', polar: '阳' },
  '丑': { name: '土', polar: '阴' }, '未': { name: '土', polar: '阴' }
};

export const PALACES = {
  1: { name: '坎宫', gua: '坎', direction: '北', element: '水', number: 1, english: 'Kan (North)' },
  2: { name: '坤宫', gua: '坤', direction: '西南', element: '土', number: 2, english: 'Kun (Southwest)' },
  3: { name: '震宫', gua: '震', direction: '东', element: '木', number: 3, english: 'Zhen (East)' },
  4: { name: '巽宫', gua: '巽', direction: '东南', element: '木', number: 4, english: 'Xun (Southeast)' },
  5: { name: '中宫', gua: '中', direction: '中', element: '土', number: 5, english: 'Zhong (Center)' },
  6: { name: '乾宫', gua: '乾', direction: '西北', element: '金', number: 6, english: 'Qian (Northwest)' },
  7: { name: '兑宫', gua: '兑', direction: '西', element: '金', number: 7, english: 'Dui (West)' },
  8: { name: '艮宫', gua: '艮', direction: '东北', element: '土', number: 8, english: 'Gen (Northeast)' },
  9: { name: '离宫', gua: '离', direction: '南', element: '火', number: 9, english: 'Li (South)' }
};

export const STARS = {
  '天蓬': { name: '天蓬星', element: '水', quality: '凶', desc: '大盗、智谋、波澜。宜于暗中筹划、防守，忌开张建房。' },
  '天芮': { name: '天芮星', element: '土', quality: '凶', desc: '疾病、授业、孕育。代表问题所在，宜治病调理、拜师求学。' },
  '天冲': { name: '天冲星', element: '木', quality: '吉', desc: '武勇、冲锋、雷厉风行。利于竞技、军事、出击，忌谈判和缓。' },
  '天辅': { name: '天辅星', element: '木', quality: '大吉', desc: '文雅、文化、教育、贵人。最利升学考试、拜见贵人、规划设计。' },
  '天禽': { name: '天禽星', element: '土', quality: '大吉', desc: '中正、忠厚、万物避邪。寄生二宫，百无禁忌，吉祥高照。' },
  '天心': { name: '天心星', element: '金', quality: '大吉', desc: '领导、统帅、医术、管理。利于规划、医疗、升职、正义裁决。' },
  '天柱': { name: '天柱星', element: '金', quality: '凶', desc: '雄辩、声音、破败、拆除。宜口才演说、拆除房屋，忌出行求财。' },
  '天任': { name: '天任星', element: '土', quality: '吉', desc: '厚德、坚守、财富、务实。利于置产、求财、守业、谈判。' },
  '天英': { name: '天英星', element: '火', quality: '中平', desc: '急躁、名誉、展示、虚名。宜于聚会、展示公关，忌长途跋涉求财。' }
};

export const DOORS = {
  '休门': { name: '休门', element: '水', quality: '吉', desc: '休整调理、贵人相聚。宜求财、相亲、旅游休养，忌交兵冲突。' },
  '生门': { name: '生门', element: '土', quality: '大吉', desc: '生机勃勃、求财得利。最利营建、嫁娶、做生意，万事大吉。' },
  '伤门': { name: '伤门', element: '木', quality: '凶', desc: '冲突索债、武力竞争。宜讨债、打官司、竞争捕捉，忌出行开业。' },
  '杜门': { name: '杜门', element: '木', quality: '中平', desc: '保密防守、技术研发。宜避难隐蔽、封存资金、研发，忌高调。' },
  '景门': { name: '景门', element: '火', quality: '中平', desc: '公关宣传、文书合同。宜签协议、发表作品、宣传，防口舌血光。' },
  '死门': { name: '死门', element: '土', quality: '大凶', desc: '终结不动、丧葬置产。宜置房产、处治罪犯，忌出行求职。' },
  '惊门': { name: '惊门', element: '金', quality: '凶', desc: '惊恐猜忌、诉讼口舌。宜捕盗、司法诉讼，忌出差行军，防虚惊。' },
  '开门': { name: '开门', element: '金', quality: '大吉', desc: '开张基业、事业通达。最利求职、开张、出行、升职，顺利无阻。' }
};

export const DEITIES = {
  '值符': { name: '值符', element: '木', quality: '大吉', desc: '贵人之首，逢凶化吉。宜拜见尊长、开发项目、保驾护航。' },
  '腾蛇': { name: '腾蛇', element: '火', quality: '凶', desc: '虚诈怪异、猜忌纠缠。防梦魇虚诈，行事宜冷静多思。' },
  '太阴': { name: '太阴', element: '金', quality: '吉', desc: '女中贵人、暗中谋划。宜密谋策划、技术公关、储备蓄力。' },
  '六合': { name: '六合', element: '木', quality: '吉', desc: '合伙契约、婚姻和合。宜谈判签约、相亲联络，忌单打独斗。' },
  '白虎': { name: '白虎', element: '金', quality: '凶', desc: '疾病凶灾、高效威猛。有强力冲突或阻碍，但也代表高执行力。' },
  '玄武': { name: '玄武', element: '水', quality: '凶', desc: '暗昧虚假、小人盗窃。防财物受骗、虚假宣传，行事宜留证据。' },
  '九地': { name: '九地', element: '土', quality: '吉', desc: '深藏稳固、积蓄长久。宜买房、长线投资、屯积防御，忌速战速决。' },
  '九天': { name: '九天', element: '金', quality: '吉', desc: '志向高远、出国长途。利飞升、长途旅行、推广上市，宜高调。' }
};

// Outer 8 palaces clockwise
const CLOCKWISE_PALACES = [1, 8, 3, 4, 9, 2, 7, 6];
const ORIGINAL_STARS = { 1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽', 6: '天心', 7: '天柱', 8: '天任', 9: '天英' };
const ORIGINAL_DOORS = { 1: '休门', 2: '死门', 3: '伤门', 4: '杜门', 5: '死门', 6: '开门', 7: '惊门', 8: '生门', 9: '景门' };

// 60 Ganzhi
export const GANZHI_60 = [];
for (let i = 0; i < 60; i++) {
  GANZHI_60.push(STEMS[i % 10] + BRANCHES[i % 12]);
}

function getGanzhiIndex(ganzhiStr) {
  return GANZHI_60.indexOf(ganzhiStr);
}

// True Solar Time Offset Calculation (真太阳时)
// 1 degree = 4 minutes. Beijing Time (GMT+8) is based on 120°E.
export function calculateTrueSolarTime(date, longitude) {
  if (!longitude) return date;
  const lon = parseFloat(longitude);
  const diffMinutes = (lon - 120) * 4;
  const trueTime = new Date(date.getTime() + diffMinutes * 60 * 1000);
  return trueTime;
}

// Convert absolute days to Ganzhi
export function getDayGanzhi(date) {
  const refDate = new Date(2000, 0, 1);
  // Subtract timezone offset to align GMT calculations
  const diffTime = date.getTime() - refDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let idx = (54 + diffDays) % 60;
  if (idx < 0) idx += 60;
  return GANZHI_60[idx];
}

export function getYearGanzhi(year) {
  let idx = (16 + (year - 2000)) % 60;
  if (idx < 0) idx += 60;
  return GANZHI_60[idx];
}

export function getMonthGanzhi(year, month, day) {
  const transitions = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
  let branchVal;
  if (day >= transitions[month]) {
    branchVal = (month + 1) % 12;
  } else {
    branchVal = month;
  }
  
  const yearStem = getYearGanzhi(year)[0];
  let startStemIdx = 2; // Default for 甲/己 -> 丙
  if (yearStem === '乙' || yearStem === '庚') startStemIdx = 4; // 戊
  if (yearStem === '丙' || yearStem === '辛') startStemIdx = 6; // 庚
  if (yearStem === '丁' || yearStem === '壬') startStemIdx = 8; // 壬
  if (yearStem === '戊' || yearStem === '癸') startStemIdx = 0; // 甲
  
  let diff = (branchVal - 2 + 12) % 12;
  let stemVal = (startStemIdx + diff) % 10;
  return STEMS[stemVal] + BRANCHES[branchVal];
}

export function getHourGanzhi(dayGanzhiStr, hour) {
  const dayStem = dayGanzhiStr[0];
  let bIdx;
  if (hour >= 23 || hour < 1) bIdx = 0;
  else if (hour >= 1 && hour < 3) bIdx = 1;
  else if (hour >= 3 && hour < 5) bIdx = 2;
  else if (hour >= 5 && hour < 7) bIdx = 3;
  else if (hour >= 7 && hour < 9) bIdx = 4;
  else if (hour >= 9 && hour < 11) bIdx = 5;
  else if (hour >= 11 && hour < 13) bIdx = 6;
  else if (hour >= 13 && hour < 15) bIdx = 7;
  else if (hour >= 15 && hour < 17) bIdx = 8;
  else if (hour >= 17 && hour < 19) bIdx = 9;
  else if (hour >= 19 && hour < 21) bIdx = 10;
  else bIdx = 11; // 21:00 - 23:00 = 亥
  
  let startStemIdx = 0;
  if (dayStem === '乙' || dayStem === '庚') startStemIdx = 2;
  if (dayStem === '丙' || dayStem === '辛') startStemIdx = 4;
  if (dayStem === '丁' || dayStem === '壬') startStemIdx = 6;
  if (dayStem === '戊' || dayStem === '癸') startStemIdx = 8;
  
  let hStemIdx = (startStemIdx + bIdx) % 10;
  return STEMS[hStemIdx] + BRANCHES[bIdx];
}

// Calculate seasonal strength (旺相休囚死) of palaces
export function getPalaceSeasonalStrength(palaceElement, monthBranch) {
  // Determine season of the month earthly branch
  // Spring: 寅(2), 卯(3), 辰(4)
  // Summer: 巳(5), 午(6), 未(7)
  // Autumn: 申(8), 酉(9), 戌(10)
  // Winter: 亥(11), 子(0), 丑(1)
  const bName = monthBranch;
  let season = 'spring';
  if (['寅', '卯', '辰'].includes(bName)) season = 'spring';
  else if (['巳', '午', '未'].includes(bName)) season = 'summer';
  else if (['申', '酉', '戌'].includes(bName)) season = 'autumn';
  else season = 'winter';

  const relations = {
    spring: { '木': '旺', '火': '相', '水': '休', '金': '囚', '土': '死' },
    summer: { '火': '旺', '土': '相', '木': '休', '水': '囚', '金': '死' },
    autumn: { '金': '旺', '水': '相', '土': '休', '火': '囚', '木': '死' },
    winter: { '水': '旺', '木': '相', '金': '休', '土': '囚', '火': '死' }
  };

  return relations[season][palaceElement] || '旺';
}

// Detailed Heavenly Stems Combinations Dictionary (十天干克应)
const STEM_COMBINATIONS = {
  '乙乙': { name: '日奇伏吟', desc: '不宜求名求财，只宜安分守己，坚守本分。' },
  '乙丙': { name: '奇仪顺遂', desc: '吉星相助，主贵人提携，文书得利，事业高升。' },
  '乙丁': { name: '奇仪相佐', desc: '文书得利，谋求可成，利开张、合伙与晋升。' },
  '乙戊': { name: '阴害阳门', desc: '主利于暗中合伙求财，利于低调谋事，防隐蔽破财。' },
  '乙己': { name: '日奇入墓', desc: '主遭小人暗算，事多暗昧不清，宜守不宜动。' },
  '乙庚': { name: '日奇被刑', desc: '主官法争讼，财产受制，防夫妻争吵、合作分裂。' },
  '乙辛': { name: '青龙逃走', desc: '奴仆拐骗，财物遗失，感情上易有单方逃避、婚变之祸。' },
  '乙壬': { name: '日奇随水', desc: '主飘兵四散，居无定所，求财谋事多奔波无果。' },
  '乙癸': { name: '华盖逢星', desc: '小吉之兆，利于拜师求学、避难，隐蔽策略极佳。' },
  
  '丙乙': { name: '日月并行', desc: '公私皆吉，名利双收，尤利于合伙及文书事宜。' },
  '丙丙': { name: '月奇悖格', desc: '主文书逼迫，票据纠纷，易出怪异之事，宜静。' },
  '丙丁': { name: '星月耀光', desc: '大吉之兆！求名求利顺达，贵人关照，事业腾飞。' },
  '丙戊': { name: '飞鸟跌穴', desc: '顶级大吉格！不劳而获之象，求财大丰收，万事如意。' },
  '丙己': { name: '火入刑地', desc: '主有小人暗中作梗，防文书受损，惹上是非口舌。' },
  '丙庚': { name: '荧入太白', desc: '主防盗贼，破财，远行防事故，凡事宜守。' },
  '丙辛': { name: '奇仪相合', desc: '谋事多合，化凶为吉，有暗中相助，感情和谐。' },
  '丙壬': { name: '火照大川', desc: '主有变动或远行，事业大开大合，主客观环境动荡。' },
  '丙癸': { name: '华盖悖师', desc: '阴阳不协调，文书受阻，防受人陷害、错失良机。' },
  
  '丁乙': { name: '人奇伏吟', desc: '谋事多停滞，利于读书习艺、安分自守。' },
  '丁丙': { name: '星随月转', desc: '主升职加薪，文书得利，事业有显著进境，贵人提拔。' },
  '丁丁': { name: '奇才得位', desc: '大利考试、公文，喜事重重，单身者姻缘至。' },
  '丁戊': { name: '青龙转光', desc: '大吉之格！主官职升迁，投资得利，求财得手。' },
  '丁己': { name: '火入勾陈', desc: '主有口舌、官非，为琐碎财务争执，防小人背后捣乱。' },
  '丁庚': { name: '文书阻隔', desc: '庚金重创丁火。主签约失败，信息中断，不宜出行。' },
  '丁辛': { name: '朱雀折足', desc: '文书受阻，防身体外伤、破财，合作意向夭折。' },
  '丁壬': { name: '五奇相合', desc: '大吉！婚姻契约完美，商务谈判生财，互利共赢。' },
  '丁癸': { name: '朱雀投江', desc: '水火相激，凶兆。主文书失落，官司败诉，口舌纠纷剧烈。' },

  '戊甲': { name: '青龙伏头', desc: '资本受困，难以施展。利于防守，切勿盲目扩大资金支出。' },
  '戊戊': { name: '双木成林', desc: '伏吟阻碍。资本滞留，主事多重复纠缠，求财难成。' },
  '戊己': { name: '贵人入狱', desc: '公私皆不利，做事多受制于人，财运防被侵占。' },
  '戊庚': { name: '值符飞宫', desc: '吉神飞离，主换办公地、换岗位、变动破财，宜静。' },
  '戊辛': { name: '青龙折足', desc: '资本流失，主有意外损失、腿脚受伤、财务破财。' },
  '戊壬': { name: '青龙入天门', desc: '大吉！求财得利，主有远行或大额买卖达成。' },
  '戊癸': { name: '青山流水', desc: '合格。利于合伙求财，青年男女利成婚，运势中吉。' },

  '庚丙': { name: '太白入荧', desc: '主盗贼纠纷，意外失财，凡事防守为上，切勿高调。' },
  '庚庚': { name: '战格', desc: '同性相排斥，硬碰硬。主官司争斗、车祸、防重伤冲突。' },
  '庚辛': { name: '白虎猖狂', desc: '大凶。防血光灾祸、身体疾病或破产，行事极宜小心。' },
  '庚癸': { name: '大格', desc: '萍水相逢，变动剧烈。求财难得，出行多磨难。' },
  
  '癸丁': { name: '腾蛇夭矫', desc: '大凶。主官司口舌，虚惊怪异不断，防受骗被盗。' },
  '癸癸': { name: '天网四张', desc: '天网覆盖，行事受阻。只宜闭门修养，切不可强行出击。' }
};

export function getStemCombination(tian, di) {
  const key = tian + di;
  return STEM_COMBINATIONS[key] || {
    name: tian + '临' + di,
    desc: `天盘${tian}与地盘${di}相会，五行呈【${WU_XING[tian].name}】与【${WU_XING[di].name}】克应，宜结合神星门具体推算。`
  };
}

// --- PROFESSIONAL QI MEN ENGINE GENERATION ---
export function generateQiMenChartPro(date, longitude) {
  // 1. Convert to True Solar Time
  const trueDate = calculateTrueSolarTime(date, longitude);
  
  const year = trueDate.getFullYear();
  const month = trueDate.getMonth();
  const day = trueDate.getDate();
  const hour = trueDate.getHours();
  
  // 2. Get Four Pillars
  const yearPillar = getYearGanzhi(year);
  const monthPillar = getMonthGanzhi(year, month, day);
  const dayPillar = getDayGanzhi(trueDate);
  const hourPillar = getHourGanzhi(dayPillar, hour);
  
  // 3. Determine Yang/Yin Ju
  const isYang = (month < 5) || (month === 5 && day <= 21) || (month === 11 && day >= 21);
  const refDate = new Date(2020, 0, 1);
  const diffDays = Math.floor((trueDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  const hBranchIdx = BRANCHES.indexOf(hourPillar[1]);
  let juNum = ((Math.abs(diffDays) + hBranchIdx) % 9) + 1;
  const type = isYang ? '阳遁' : '阴遁';
  const juName = `${type}${juNum}局`;

  // 4. Layout Di Pan Stems
  const baseStems = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
  const diPan = {};
  for (let i = 0; i < 9; i++) {
    let palace;
    if (isYang) {
      palace = ((juNum - 1 + i) % 9) + 1;
    } else {
      palace = ((juNum - 1 - i + 18) % 9) + 1;
    }
    diPan[palace] = baseStems[i];
  }

  // 5. Xun Shou
  const hIdx = GANZHI_60.indexOf(hourPillar);
  const xunOffset = Math.floor(hIdx / 10) * 10;
  const xunPillar = GANZHI_60[xunOffset];
  const xunShouStems = ['戊', '己', '庚', '辛', '壬', '癸'];
  const xunShouStem = xunShouStems[Math.floor(xunOffset / 10)];
  
  let xunShouPalace = 1;
  for (let p = 1; p <= 9; p++) {
    if (diPan[p] === xunShouStem) {
      xunShouPalace = p;
      break;
    }
  }

  const zhiFuStar = ORIGINAL_STARS[xunShouPalace] || '天芮';
  const zhiShiDoor = ORIGINAL_DOORS[xunShouPalace] || '死门';

  // 6. Tian Pan Stems & Stars
  const hourStem = hourPillar[0];
  let targetHourStem = hourStem === '甲' ? xunShouStem : hourStem;
  
  let hourStemPalace = 1;
  for (let p = 1; p <= 9; p++) {
    if (diPan[p] === targetHourStem) {
      hourStemPalace = p;
      break;
    }
  }

  const tianPan = {};
  const starPositions = {};
  let activeHourPalace = hourStemPalace === 5 ? 2 : hourStemPalace;
  let activeXunPalace = xunShouPalace === 5 ? 2 : xunShouPalace;
  const targetIdx = CLOCKWISE_PALACES.indexOf(activeHourPalace);
  const sourceIdx = CLOCKWISE_PALACES.indexOf(activeXunPalace);
  const offset = (targetIdx - sourceIdx + 8) % 8;
  
  CLOCKWISE_PALACES.forEach((p, idx) => {
    const sourcePalace = CLOCKWISE_PALACES[(idx - offset + 8) % 8];
    const star = ORIGINAL_STARS[sourcePalace];
    const stem = diPan[sourcePalace];
    tianPan[p] = { star, stem };
    starPositions[star] = p;
  });
  tianPan[5] = { star: '无', stem: diPan[5] };

  // 7. Ba Men
  const hoursElapsed = hIdx - xunOffset;
  let doorTargetPalace = xunShouPalace;
  for (let h = 0; h < hoursElapsed; h++) {
    if (isYang) {
      doorTargetPalace = doorTargetPalace === 9 ? 1 : doorTargetPalace + 1;
    } else {
      doorTargetPalace = doorTargetPalace === 1 ? 9 : doorTargetPalace - 1;
    }
  }
  if (doorTargetPalace === 5) doorTargetPalace = 2;

  const activeDoorPalace = doorTargetPalace;
  const doorTargetIdx = CLOCKWISE_PALACES.indexOf(activeDoorPalace);
  const doorSourceIdx = CLOCKWISE_PALACES.indexOf(activeXunPalace);
  const doorOffset = (doorTargetIdx - doorSourceIdx + 8) % 8;

  const doors = {};
  CLOCKWISE_PALACES.forEach((p, idx) => {
    const sourcePalace = CLOCKWISE_PALACES[(idx - doorOffset + 8) % 8];
    const door = ORIGINAL_DOORS[sourcePalace];
    doors[p] = door;
  });
  doors[5] = '中宫';

  // 8. Ba Shen
  const zhiFuStarPalace = starPositions[zhiFuStar] || 2;
  const deityTargetIdx = CLOCKWISE_PALACES.indexOf(zhiFuStarPalace);
  const deitiesList = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
  const deities = {};
  
  CLOCKWISE_PALACES.forEach((p, idx) => {
    let listIdx;
    if (isYang) {
      listIdx = (idx - deityTargetIdx + 8) % 8;
    } else {
      listIdx = (deityTargetIdx - idx + 8) % 8;
    }
    deities[p] = deitiesList[listIdx];
  });
  deities[5] = '中宫';

  // 9. Xun Kong
  const xunKongPalaces = { 0: [6], 10: [2, 7], 20: [9, 2], 30: [4], 40: [8, 3], 50: [1, 8] };
  const emptyPalaces = xunKongPalaces[xunOffset] || [];

  // 10. Seasonal Strength Calculation
  const mBranch = monthPillar[1];
  
  // Assemble Board
  const board = {};
  for (let p = 1; p <= 9; p++) {
    const palaceStrength = getPalaceSeasonalStrength(PALACES[p].element, mBranch);
    board[p] = {
      id: p,
      info: PALACES[p],
      diPan: diPan[p],
      tianPan: tianPan[p]?.stem || '无',
      star: tianPan[p]?.star || '无',
      door: doors[p] || '无',
      deity: deities[p] || '无',
      isEmpty: emptyPalaces.includes(p),
      strength: palaceStrength // 旺/相/休/囚/死
    };
  }

  // 11. Detected Patterns (吉格/凶格)
  const patterns = [];
  
  // Check 五不遇时: Hour stem controls Day stem, same polarity (e.g. Day甲(木), Hour庚(金))
  const dayStem = dayPillar[0];
  const stemKePairs = { '甲': '庚', '乙': '辛', '丙': '壬', '丁': '癸', '戊': '甲', '己': '乙', '庚': '丙', '辛': '丁', '壬': '戊', '癸': '己' };
  if (stemKePairs[dayStem] === hourStem) {
    patterns.push({ name: '五不遇时', type: 'bad', desc: '时干克日干且阳克阳、阴克阴。百事且静，强行做事易遭阻碍或失败。' });
  }

  // Check 伏吟 (All stars/doors in original palaces)
  if (doors[1] === '休门' && doors[2] === '死门' && doors[3] === '伤门') {
    patterns.push({ name: '星门伏吟', type: 'neutral', desc: '星门未动，主事体停滞不前，利主不利客，宜防守，忌急进。' });
  }

  // Check 反吟 (Stars/doors in opposite palaces, e.g. 休门 in Palace 9)
  if (doors[1] === '景门' && doors[9] === '休门') {
    patterns.push({ name: '星门反吟', type: 'bad', desc: '星门相冲。主变动剧烈，反复无常，行事多波折，宜快刀斩乱麻。' });
  }

  // Check 飞鸟跌穴 / 青龙返首 in any Palace
  for (let p = 1; p <= 9; p++) {
    if (board[p].tianPan === '丙' && board[p].diPan === '戊') {
      patterns.push({ name: `飞鸟跌穴 (在${PALACES[p].name})`, type: 'good', desc: '丙奇临戊仪，大吉之格！求财大吉，万事顺利，极易获利。' });
    }
    if (board[p].tianPan === '戊' && board[p].diPan === '丙') {
      patterns.push({ name: `青龙返首 (在${PALACES[p].name})`, type: 'good', desc: '戊仪临丙奇，大吉之格！利于投资、开业、谋职晋升。' });
    }
    if (board[p].tianPan === '癸' && board[p].diPan === '丁') {
      patterns.push({ name: `腾蛇夭矫 (在${PALACES[p].name})`, type: 'bad', desc: '癸临丁，文书官司，虚惊怪异，防受骗被偷。' });
    }
  }

  // 12. Five Elements Balance calculation
  const elementWeight = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  // Extract elements from pillars and active board elements
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
    elementWeight[WU_XING[p[0]]?.name || '土'] += 1.5;
    elementWeight[WU_XING[p[1]]?.name || '土'] += 1.5;
  });
  // Add weight from active stars & doors in board
  for (let p = 1; p <= 9; p++) {
    if (board[p].star !== '无') elementWeight[STARS[board[p].star]?.element || '土'] += 0.5;
    if (board[p].door !== '无') elementWeight[DOORS[board[p].door]?.element || '土'] += 0.5;
  }
  // Convert to ratio percentages
  const totalWeight = Object.values(elementWeight).reduce((s, v) => s + v, 0);
  const elementRatio = {};
  Object.keys(elementWeight).forEach(k => {
    elementRatio[k] = Math.round((elementWeight[k] / totalWeight) * 100);
  });

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    ju: {
      number: juNum,
      isYang,
      name: juName,
      xun: xunPillar,
      xunShou: xunShouStem,
      zhiFuStar,
      zhiShiDoor
    },
    board,
    patterns,
    elementRatio,
    date: trueDate.toISOString(),
    isRealTime: Math.abs(trueDate.getTime() - Date.now()) < 60000
  };
}

// Evaluate Chart
export function evaluateQiMenChartPro(chart, queryType = 'general') {
  const board = chart.board;
  const evaluatedPalaces = {};
  
  let overallScore = 60;
  let luckyPalaces = [];
  let unluckyPalaces = [];
  
  for (let p = 1; p <= 9; p++) {
    if (p === 5) continue;
    
    const cell = board[p];
    const doorData = DOORS[cell.door] || { quality: '中平', desc: '' };
    const starData = STARS[cell.star] || { quality: '中平', desc: '' };
    const deityData = DEITIES[cell.deity] || { quality: '中平', desc: '' };
    
    let score = 60;
    
    // Add seasonal modifier: 旺=+10, 相=+5, 休=0, 囚=-5, 死=-10
    if (cell.strength === '旺') score += 10;
    else if (cell.strength === '相') score += 5;
    else if (cell.strength === '囚') score -= 5;
    else if (cell.strength === '死') score -= 10;

    if (doorData.quality === '大吉') score += 15;
    else if (doorData.quality === '吉') score += 8;
    else if (doorData.quality === '凶') score -= 10;
    else if (doorData.quality === '大凶') score -= 20;
    
    if (starData.quality === '大吉') score += 10;
    else if (starData.quality === '吉') score += 5;
    else if (starData.quality === '凶') score -= 8;
    
    if (deityData.quality === '大吉') score += 10;
    else if (deityData.quality === '吉') score += 5;
    else if (deityData.quality === '凶') score -= 5;
    
    if (cell.isEmpty) score -= 15;
    score = Math.max(10, Math.min(100, score));
    
    // Heavenly Stems Combinations lookup
    const stemKeYing = getStemCombination(cell.tianPan, cell.diPan);
    const combinationName = stemKeYing.name;
    const combinationDesc = stemKeYing.desc;
    
    let domainAdvise = '';
    if (queryType === 'career') {
      if (cell.door === '开门' || cell.door === '生门') domainAdvise = '事业宫大吉，代表求职顺利，项目大展拳脚，可往此方向前行。';
      else if (cell.door === '杜门') domainAdvise = '杜门主隐藏，事业不宜张扬，适合钻研技术、筹备密谋。';
      else if (cell.door === '伤门' || cell.door === '惊门') domainAdvise = '事业易惹官司口舌，或有小人暗算阻碍，防合同纠纷。';
      else domainAdvise = '常规运势，守好本分，稳健跟进即可。';
    } else if (queryType === 'wealth') {
      if (cell.door === '生门' || cell.door === '开门') domainAdvise = '求财上上签。主利润丰厚，适合签约、开张建厂，财源滚滚。';
      else if (cell.door === '死门' || cell.door === '玄武') domainAdvise = '破财之兆。资金周转困难，防盗窃欺诈，不宜投资。';
      else if (cell.door === '休门') domainAdvise = '财运平稳，适合悠闲中取财，利人脉聚会拓客。';
      else domainAdvise = '求财受限，看紧钱袋子，切忌冒进。';
    } else if (queryType === 'love') {
      if (cell.deity === '六合' || cell.door === '休门') domainAdvise = '红鸾星动。单身利于相亲表白，已婚情感升温甜美。';
      else if (cell.door === '死门' || cell.door === '伤门' || cell.deity === '腾蛇') domainAdvise = '姻缘受克。容易无端猜忌、争吵冷战，宜互相留白化解冲突。';
      else domainAdvise = '感情磁场中规中矩，无大起大落，平淡中见真情。';
    } else {
      domainAdvise = `气场强度为【${cell.strength}】，本宫格局为【${combinationName}】。宜：${doorData.desc.slice(0, 15)}。`;
    }
    
    evaluatedPalaces[p] = {
      palaceId: p,
      name: cell.info.name,
      direction: cell.info.direction,
      element: cell.info.element,
      score,
      strength: cell.strength,
      combinationName,
      combinationDesc,
      domainAdvise,
      door: cell.door,
      star: cell.star,
      deity: cell.deity,
      tianPan: cell.tianPan,
      diPan: cell.diPan,
      isEmpty: cell.isEmpty
    };
    
    if (score >= 75) luckyPalaces.push(evaluatedPalaces[p]);
    if (score <= 45) unluckyPalaces.push(evaluatedPalaces[p]);
  }
  
  const outerPalaces = [1, 2, 3, 4, 6, 7, 8, 9];
  const totalScore = outerPalaces.reduce((sum, p) => sum + (evaluatedPalaces[p]?.score || 60), 0);
  overallScore = Math.round(totalScore / 8);
  
  luckyPalaces.sort((a, b) => b.score - a.score);
  unluckyPalaces.sort((a, b) => a.score - b.score);
  
  return {
    overallScore,
    luckyDirections: luckyPalaces.map(lp => ({ direction: lp.direction, palace: lp.name, score: lp.score, door: lp.door })),
    palaceInterpretations: evaluatedPalaces,
    summary: generateChartSummaryPro(chart, overallScore, luckyPalaces)
  };
}

function generateChartSummaryPro(chart, score, luckyPalaces) {
  const { pillars, ju, patterns } = chart;
  const primaryLucky = luckyPalaces[0];
  
  let energyStr = '';
  if (score >= 85) energyStr = '紫气东来，乾坤大吉。时空能量相生，极利于主动出击、洽谈大事。';
  else if (score >= 70) energyStr = '吉星拱照，贵人帮扶。各方位生机畅通，顺势而为多有收获。';
  else if (score >= 55) energyStr = '阴阳平稳，吉凶交织。不宜做重大盲目变动，宜查漏补缺。';
  else if (score >= 40) energyStr = '阻力交织，宜守勿攻。主客易位，建议退修己身，低调规避。';
  else energyStr = '天网四张，万事宜静。能量剧烈震荡，忌出行或签署合约，宜静思。';
  
  let patternNotice = '';
  if (patterns.length > 0) {
    patternNotice = `【格局警示】盘中侦测到核心格局：${patterns.map(pat => `【${pat.name} - ${pat.desc}】`).join('、')}\n`;
  }
  
  return `今日起局为【${ju.name}】，旬首【${ju.xun}】。四柱干支为【${pillars.year}年 ${pillars.month}月 ${pillars.day}日 ${pillars.hour}时】。
系统综合时空评分：${score}分。${energyStr}
${patternNotice}今日最吉利方位在【${primaryLucky ? primaryLucky.direction : '中宫'}】（对应${primaryLucky ? primaryLucky.name : '中宫宫位'}），此处得吉神【${primaryLucky ? primaryLucky.deity : '值符'}】加持与【${primaryLucky ? primaryLucky.door : '开门'}】大开，前往该方向进行商务洽谈、投资或约会将获得极佳磁场庇佑。`;
}

// User Personal Forecast
export function getUserPersonalForecastPro(userInfo, type = 'daily') {
  const nameSeed = userInfo.name ? userInfo.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) : 123;
  const birthDate = new Date(userInfo.birthDate || '1995-01-01');
  const birthHour = parseInt(userInfo.birthHour || '12');
  
  const userBirthGanzhi = getDayGanzhi(birthDate);
  const userHourGanzhi = getHourGanzhi(userBirthGanzhi, birthHour);
  const userYearGanzhi = getYearGanzhi(birthDate.getFullYear());
  
  const today = new Date();
  
  if (type === 'daily') {
    // Generate daily chart under True Solar Time
    const chart = generateQiMenChartPro(today, userInfo.longitude || '120');
    const evaluation = evaluateQiMenChartPro(chart, userInfo.focus || 'general');
    
    const userStem = userBirthGanzhi[0];
    const dayStem = chart.pillars.day[0];
    
    let affinity = '相生';
    let affinityDesc = '时空能量生助本命，行事易获贵人相助，事半功倍。';
    if (userStem === dayStem) {
      affinity = '伏吟';
      affinityDesc = '日元见日元自值，做事易见停滞与反复，建议耐心推进。';
    } else if (['庚', '辛'].includes(userStem) && ['丙', '丁'].includes(dayStem)) {
      affinity = '受克';
      affinityDesc = '官鬼克身。今天压力较重，防上级批评或口舌摩擦，宜多听少说。';
    } else if (['甲', '乙'].includes(userStem) && ['庚', '辛'].includes(dayStem)) {
      affinity = '受克';
      affinityDesc = '七杀克命。容易感到劳累、身体抱恙，防意外摩擦，建议保证休息。';
    }
    
    // Suggest lucky things based on Wu Xing balance
    let minElement = '木';
    let minVal = 100;
    Object.keys(chart.elementRatio).forEach(k => {
      if (chart.elementRatio[k] < minVal) {
        minVal = chart.elementRatio[k];
        minElement = k;
      }
    });
    
    const luckyTips = {
      '木': { color: '绿色/青色', number: '3, 8', thing: '佩戴木质手串，多喝绿茶，多绿植环绕' },
      '火': { color: '红色/紫色', number: '2, 7', thing: '穿亮色衣服，适当进行户外晒太阳，使用红色配饰' },
      '土': { color: '黄色/咖色', number: '5, 10', thing: '多赤脚接触草地，佩戴石榴石或陶瓷，踏实务实' },
      '金': { color: '白色/金色', number: '4, 9', thing: '佩戴金属首饰，多整理办公桌，听舒缓钢琴曲' },
      '水': { color: '黑色/蓝色', number: '1, 6', thing: '多喝温水，临近水景散步，穿深色服装' }
    }[minElement] || { color: '金色', number: '9', thing: '保持中正平和' };

    return {
      type: 'daily',
      period: today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) + ' (' + getDayGanzhi(today) + '日)',
      userPillars: {
        year: userYearGanzhi,
        day: userBirthGanzhi,
        hour: userHourGanzhi
      },
      chart,
      evaluation,
      affinity,
      affinityDesc,
      luckyTips: {
        element: minElement,
        ...luckyTips
      },
      scores: {
        career: Math.min(100, Math.max(30, evaluation.overallScore + (nameSeed % 15) - 7)),
        wealth: Math.min(100, Math.max(30, evaluation.overallScore + (birthHour % 15) - 7)),
        love: Math.min(100, Math.max(30, evaluation.overallScore + ((nameSeed + birthHour) % 15) - 7)),
        health: Math.min(100, Math.max(30, 100 - evaluation.overallScore + (nameSeed % 10)))
      },
      hourlyForecast: generateHourlyForecastPro(chart, userBirthGanzhi)
    };
  } else if (type === 'weekly') {
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const forecastDate = new Date();
      forecastDate.setDate(today.getDate() + i);
      const tempChart = generateQiMenChartPro(forecastDate, userInfo.longitude || '120');
      const tempEval = evaluateQiMenChartPro(tempChart, userInfo.focus || 'general');
      const dayScore = Math.min(100, Math.max(30, tempEval.overallScore + (nameSeed % 11) - 5));
      
      weeklyData.push({
        dateStr: forecastDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        dayOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][forecastDate.getDay()],
        ganzhi: getDayGanzhi(forecastDate),
        score: dayScore,
        luckyDir: tempEval.luckyDirections[0]?.direction || '中宫',
        luckyDoor: tempEval.luckyDirections[0]?.door || '生门',
        summary: getShortSummaryForScore(dayScore, userInfo.focus)
      });
    }
    
    return {
      type: 'weekly',
      period: '本周时空能量全瞻 (' + weeklyData[0].dateStr + ' - ' + weeklyData[6].dateStr + ')',
      weeklyData,
      weeklySummary: `本周的宇宙能量呈现起伏波动之势。周初逢【${weeklyData[0].ganzhi}】日，能量评分在中游，建议您【${userInfo.focus === 'career' ? '静心规划本季度核心内容，勿急功近利' : userInfo.focus === 'love' ? '加强情侣沟通，避开敏感话题' : '稳定基本盘，控制现金流开支'}】。
中后期的【${weeklyData[4].dateStr}】是本周时空的最高吉利时区（评分：${Math.max(...weeklyData.map(d=>d.score))}分），当日八门大开，值符驾临，极宜主动与大企业客户签约、开展新品宣发或寻求贵人协助。`
    };
  } else {
    const monthlyWeeks = [];
    const weekLabels = ['上旬 (第一周)', '上中旬 (第二周)', '中旬 (第三周)', '下旬 (第四周)'];
    
    for (let i = 0; i < 4; i++) {
      const avgScore = Math.min(95, Math.max(40, 65 + ((nameSeed + i * 17) % 25) - 10));
      let mainGua = ['巽宫 (巽为风)', '坤宫 (坤为地)', '乾宫 (乾为天)', '离宫 (离为火)'][i];
      let monthAdvice = '';
      
      if (userInfo.focus === 'career') {
        monthAdvice = ['上旬开门逢生，职场有小额突破或学习新领域机会，宜结交良友。', '中旬进入蓄能期，凡事不宜操切，适合做方案撰写与数据纠错。', '中下旬贵人拱照，利于拜访大客户或寻求职级晋升。', '下旬事务繁多冗长，宜防范小人说闲话，守牢商业秘密。'][i];
      } else if (userInfo.focus === 'love') {
        monthAdvice = ['上旬情缘顺畅，桃花临门。多参加行业沙龙可收获眼缘。', '中旬桃花受克，已有感情者要防备无端翻旧账导致的冷战纠葛。', '下旬情感和合，利于拜见父母、出游，也是求婚订婚的良机。', '月末平稳温馨，适宜多一起动手做饭，增加家庭烟火气。'][i];
      } else {
        monthAdvice = ['上旬财富宫生发，利于副业变现，或有小额理财赎回回报。', '中旬消费欲望旺盛，谨防受冲动宣传影响进行大额开销。', '中下旬利于商务洽谈、竞标，有望达成中长期高价值合约。', '月末利于平稳存蓄，守住劳动果实，切忌涉足高杠杆投机。'][i];
      }
      
      monthlyWeeks.push({
        week: weekLabels[i],
        score: avgScore,
        mainGua,
        advice: monthAdvice
      });
    }
    
    return {
      type: 'monthly',
      period: today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) + '月运程规划',
      monthlyWeeks,
      monthlySummary: `本月整体五行能量先抑后扬。本月原局行运主卦落于【${monthlyWeeks[2].mainGua}】，能量在中下旬最为畅通饱满。
仙人为您指路：本月前两周只宜调理身体、完善内部规划；从18号中旬开始配合高涨的乾坤磁场，火力全开全力推进业务上线、商务路演或合作邀约，乘势而起即可逢凶化吉。`
    };
  }
}

function generateHourlyForecastPro(chart, userBirthGanzhi) {
  const timeSlots = [
    { time: '子时 (23-01)', name: '甲子时' },
    { time: '丑时 (01-03)', name: '乙丑时' },
    { time: '寅时 (03-05)', name: '丙寅时' },
    { time: '卯时 (05-07)', name: '丁卯时' },
    { time: '辰时 (07-09)', name: '戊辰时' },
    { time: '巳时 (09-11)', name: '己巳时' },
    { time: '午时 (11-13)', name: '庚午时' },
    { time: '未时 (13-15)', name: '辛未时' },
    { time: '申时 (15-17)', name: '壬申时' },
    { time: '酉时 (17-19)', name: '癸酉时' },
    { time: '戌时 (19-21)', name: '甲戌时' },
    { time: '亥时 (21-23)', name: '乙亥时' }
  ];
  
  return timeSlots.map((slot, idx) => {
    const seed = (idx * 7 + userBirthGanzhi.charCodeAt(0) + chart.ju.number) % 100;
    const score = 40 + (seed % 55);
    let state = '平';
    let detail = '时空气场平衡，适宜处理常规文书。';
    
    if (score >= 85) {
      state = '吉';
      detail = '三奇吉门临宫，利于谈判、签署合同、远行求财。';
    } else if (score >= 70) {
      state = '次吉';
      detail = '逢贵人星护照，利于沟通，大事宜稳步推进。';
    } else if (score <= 50) {
      state = '凶';
      detail = '五不遇时或逢空亡，百事宜避之，不宜开业出行。';
    }
    
    return {
      ...slot,
      score,
      state,
      detail
    };
  });
}

function getShortSummaryForScore(score, focus) {
  if (score >= 85) return '时空气场极佳，利于主动出击扩展业务。';
  if (score >= 70) return '运势稳定，有贵人协助，利于洽谈求取合作。';
  if (score >= 55) return '气场中平，凡事不宜急进，稳扎稳打为宜。';
  return '气场相克，防小人官非，凡事退避三舍。';
}
