/**
 * 국가명을 받아서 해당 국가의 플래그 이모지를 반환하는 함수
 */

// 국가명과 플래그 이모지 매핑
const countryFlagMap: Record<string, string> = {
  // 아시아
  '일본': '🇯🇵',
  '중국': '🇨🇳',
  '대만': '🇹🇼',
  '홍콩': '🇭🇰',
  '싱가포르': '🇸🇬',
  '태국': '🇹🇭',
  '베트남': '🇻🇳',
  '인도네시아': '🇮🇩',
  '말레이시아': '🇲🇾',
  '필리핀': '🇵🇭',
  '인도': '🇮🇳',
  
  // 유럽
  '독일': '🇩🇪',
  '프랑스': '🇫🇷',
  '영국': '🇬🇧',
  '이탈리아': '🇮🇹',
  '스페인': '🇪🇸',
  '네덜란드': '🇳🇱',
  '스웨덴': '🇸🇪',
  '노르웨이': '🇳🇴',
  '덴마크': '🇩🇰',
  '핀란드': '🇫🇮',
  '스위스': '🇨🇭',
  '오스트리아': '🇦🇹',
  '벨기에': '🇧🇪',
  '체코': '🇨🇿',
  '폴란드': '🇵🇱',
  '헝가리': '🇭🇺',
  '러시아': '🇷🇺',
  
  // 북미
  '미국': '🇺🇸',
  '캐나다': '🇨🇦',
  '멕시코': '🇲🇽',
  
  // 오세아니아
  '호주': '🇦🇺',
  '뉴질랜드': '🇳🇿',
  
  // 남미
  '브라질': '🇧🇷',
  '아르헨티나': '🇦🇷',
  '칠레': '🇨🇱',
  
  // 아프리카
  '남아프리카공화국': '🇿🇦',
  '이집트': '🇪🇬',
  
  // 기타
  '이스라엘': '🇮🇱',
  '터키': '🇹🇷',
};

// 영어 국가명 매핑 (선택사항)
const englishCountryFlagMap: Record<string, string> = {
  'japan': '🇯🇵',
  'china': '🇨🇳',
  'taiwan': '🇹🇼',
  'hong kong': '🇭🇰',
  'singapore': '🇸🇬',
  'thailand': '🇹🇭',
  'vietnam': '🇻🇳',
  'indonesia': '🇮🇩',
  'malaysia': '🇲🇾',
  'philippines': '🇵🇭',
  'india': '🇮🇳',
  'germany': '🇩🇪',
  'france': '🇫🇷',
  'united kingdom': '🇬🇧',
  'uk': '🇬🇧',
  'italy': '🇮🇹',
  'spain': '🇪🇸',
  'netherlands': '🇳🇱',
  'sweden': '🇸🇪',
  'norway': '🇳🇴',
  'denmark': '🇩🇰',
  'finland': '🇫🇮',
  'switzerland': '🇨🇭',
  'austria': '🇦🇹',
  'belgium': '🇧🇪',
  'czech republic': '🇨🇿',
  'poland': '🇵🇱',
  'hungary': '🇭🇺',
  'russia': '🇷🇺',
  'united states': '🇺🇸',
  'usa': '🇺🇸',
  'canada': '🇨🇦',
  'mexico': '🇲🇽',
  'australia': '🇦🇺',
  'new zealand': '🇳🇿',
  'brazil': '🇧🇷',
  'argentina': '🇦🇷',
  'chile': '🇨🇱',
  'south africa': '🇿🇦',
  'egypt': '🇪🇬',
  'israel': '🇮🇱',
  'turkey': '🇹🇷',
};

/**
 * 국가명을 받아서 해당 국가의 플래그 이모지를 반환
 * @param countryName 국가명 (한국어 또는 영어)
 * @returns 플래그 이모지 (매핑되지 않은 경우 기본 이모지)
 */
export function getCountryFlag(countryName: string): string {
  if (!countryName) return '🏳️'; // 기본 플래그
  
  // 한국어 매핑 시도
  const koreanFlag = countryFlagMap[countryName];
  if (koreanFlag) return koreanFlag;
  
  // 영어 매핑 시도 (소문자로 변환)
  const englishFlag = englishCountryFlagMap[countryName.toLowerCase()];
  if (englishFlag) return englishFlag;
  
  // 매핑되지 않은 경우 기본 플래그
  return '🏳️';
}

/**
 * 국가명 리스트 반환 (디버깅용)
 */
export function getSupportedCountries(): string[] {
  return [
    ...Object.keys(countryFlagMap),
    ...Object.keys(englishCountryFlagMap)
  ];
}