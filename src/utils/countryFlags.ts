/**
 * 국가명을 받아서 해당 국가의 플래그 이모지를 반환하는 함수
 */

// 국가명과 플래그 이모지 매핑
const countryFlagMap: Record<string, string> = {
  // 아시아
  '일본': '🇯🇵',
  '중국': '🇨🇳',
  '대만': '🇹🇼',
  '말레이시아': '🇲🇾',
  '태국': '🇹🇭',
  '홍콩': '🇭🇰',
  
  // 영어권
  '미국': '🇺🇸',
  '캐나다': '🇨🇦',
  '호주': '🇦🇺',
  '멕시코': '🇲🇽',
  'UAE': '🇦🇪',
  
  // 유럽권
  '그리스': '🇬🇷',
  '네덜란드': '🇳🇱',
  '노르웨이': '🇳🇴',
  '덴마크': '🇩🇰',
  '독일': '🇩🇪',
  '라트비아': '🇱🇻',
  '러시아': '🇷🇺',
  '리투아니아': '🇱🇹',
  '스웨덴': '🇸🇪',
  '스위스': '🇨🇭',
  '스페인': '🇪🇸',
  '슬로베니아': '🇸🇮',
  '에스토니아': '🇪🇪',
  '영국': '🇬🇧',
  '오스트리아': '🇦🇹',
  '이탈리아': '🇮🇹',
  '체코': '🇨🇿',
  '튀르키에': '🇹🇷',
  '포르투갈': '🇵🇹',
  '폴란드': '🇵🇱',
  '프랑스': '🇫🇷',
  '핀란드': '🇫🇮',
  '헝가리': '🇭🇺',
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
  
  // 매핑되지 않은 경우 기본 플래그
  return '🏳️';
}

/**
 * 국가명 리스트 반환 (디버깅용)
 */
export function getSupportedCountries(): string[] {
  return [
    ...Object.keys(countryFlagMap),
  ];
}