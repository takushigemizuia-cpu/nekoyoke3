import { FrequencyPreset } from '../types';

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
  {
    id: 'rat_sweep',
    name: 'ネズミ専用 超高周波スイープ',
    target: 'クマネズミ・ドブネズミ (22~24kHz)',
    freqMin: 22000,
    freqMax: 24000,
    description: 'スマホスピーカーの出力限界（22k〜24kHz）をフル活用。聴覚の極めて鋭いネズミの警戒心を煽る最高周波数スイープ。',
    iconName: 'Zap',
    recommended: true,
    category: 'rat',
  },
  {
    id: 'rat_attic',
    name: '天井裏・台所 害獣カオス',
    target: '天井裏・床下のネズミ定着防止 (20~24kHz)',
    freqMin: 20000,
    freqMax: 24000,
    description: '不規則な高速ランダム跳躍音を発信。ネズミの周波数への慣れを防止し、巣作りや夜間の巡回を阻害します。',
    iconName: 'Shuffle',
    recommended: false,
    category: 'rat',
  },
  {
    id: 'dual_guard',
    name: '猫 ＋ ネズミ 両対応ワイド',
    target: '猫・ネズミ同時に遠ざける (18~23.5kHz)',
    freqMin: 18000,
    freqMax: 23500,
    description: '猫の敏感域(18〜20kHz)とネズミの超音波域(21〜23.5kHz)を交互に無段階連続スキャン。庭・ゴミ置き場・玄関の総合防護に最適。',
    iconName: 'ShieldAlert',
    recommended: true,
    category: 'dual',
  },
  {
    id: 'sweep_auto',
    name: '野良猫 自動スイープ',
    target: '野良猫全般・慣れ防止 (16~22kHz)',
    freqMin: 16000,
    freqMax: 22000,
    description: '周波数が16kHz〜22kHz間で連続変化し、音への慣れを防ぐ猫撃退の定番モードです。',
    iconName: 'Activity',
    recommended: false,
    category: 'cat',
  },
  {
    id: 'rat_pulse',
    name: 'ネズミ急襲 パルス攻撃',
    target: 'キッチン・物置のネズミ追い払い (23kHz断続)',
    freqMin: 23000,
    freqMax: 23000,
    description: '23kHzの超音波数値をミリ秒単位で高速オン・オフ。ネズミに強い音圧刺激と警戒ストレスを与えます。',
    iconName: 'VolumeX',
    recommended: false,
    category: 'rat',
  },
  {
    id: 'young_cat',
    name: '子猫・若猫向け超音波',
    target: '生後数ヶ月〜2歳の猫 (20~24kHz)',
    freqMin: 20000,
    freqMax: 24000,
    description: '高周波数に非常に敏感な若い猫に特化。人間には完全無音で静かに撃退します。',
    iconName: 'Radio',
    recommended: false,
    category: 'cat',
  },
  {
    id: 'standard_cat',
    name: '成猫・一般野良猫',
    target: '成猫・一般的な猫 (17~20kHz)',
    freqMin: 17000,
    freqMax: 20000,
    description: '成猫の聴覚に強く刺激を与える標準周波数。庭やフン害の起きやすい場所の警戒に最適。',
    iconName: 'ShieldAlert',
    recommended: false,
    category: 'cat',
  },
  {
    id: 'long_distance',
    name: '広範囲・強力遠到達波',
    target: '屋外・広大エリア (15~17.5kHz)',
    freqMin: 15000,
    freqMax: 17500,
    description: '空気を伝わりやすい中高周波で遠くまで到達。※若年者には高音のモスキート音として聞こえる場合があります。',
    iconName: 'Radio',
    recommended: false,
    category: 'dual',
  },
];

export const CAT_SAFETY_GUIDE = [
  {
    title: 'ネズミ・害獣の聴覚特性と超音波効果',
    content:
      'ネズミ（クマネズミ・ドブネズミ・ハツカネズミ等）は非常に鋭い聴覚を持ち、最高70kHz以上の超高音まで認識します。本アプリはスマホスピーカーから出力可能な最高帯域（20kHz〜24kHz）をフル活用し、ネズミにとって耐えがたい高周波ノイズ空間を作り出して退去を促します。',
  },
  {
    title: '猫とネズミの可聴域の違い',
    content:
      '猫の可聴限界は約64,000Hz(64kHz)で、主な刺激帯域は17k〜22kHzです。一方ネズミは20k〜24kHz以上の超高周波帯に強く反応します。「猫＋ネズミ両対応ワイド」モードを使用することで、両者の警戒域を横断してカバーできます。',
  },
  {
    title: '効果的な設置場所（室内・屋外・天井裏）',
    content:
      '【ネズミ対策】天井裏の点検口、キッチン・シンク下、米・食品の保管場所、物置の隅にスピーカーを向けて静置してください。【野良猫対策】玄関先、フン害の起きる庭・花壇、駐車場などに設置してください。',
  },
  {
    title: '慣れ防止と長期運用テクニック',
    content:
      'ネズミや猫は一定の単一音域を聞き続けると「害のない背景音」として学習してしまいます。日常的に「スイープ発信」や「カオス変調」を活用するか、定期的に「パルス音」へ切り替えることで慣れを徹底的に防げます。',
  },
  {
    title: '安全上の注意とペットへの配慮',
    content:
      '飼い猫・飼い犬や、ハムスター・モルモット等の小動物ペットを同室で飼育している場合、ペットのストレスとなるため同室内での使用はお控えください。',
  },
];

