/**
 * Fuzzy search utility for command filtering
 * Scores items based on character sequence matching
 */

export interface FuzzyItem {
  id: string;
  label: string;
  searchText: string;
}

export interface FuzzyResult<T extends FuzzyItem> {
  item: T;
  score: number;
  matches: number[];
}

export function fuzzySearch<T extends FuzzyItem>(
  query: string,
  items: T[]
): FuzzyResult<T>[] {
  if (!query.trim()) {
    return items.map((item) => ({ item, score: 0, matches: [] }));
  }

  const searchQuery = query.toLowerCase();
  const results: FuzzyResult<T>[] = [];

  for (const item of items) {
    const searchText = item.searchText.toLowerCase();
    const score = calculateFuzzyScore(searchQuery, searchText);

    if (score > 0) {
      const matches = getMatchIndices(searchQuery, searchText);
      results.push({ item, score, matches });
    }
  }

  // Sort by score descending, then by item index
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Calculate fuzzy match score
 * Higher scores = better matches
 */
function calculateFuzzyScore(query: string, text: string): number {
  let score = 0;
  let textIndex = 0;
  let queryIndex = 0;
  let consecutiveMatches = 0;

  while (queryIndex < query.length && textIndex < text.length) {
    if (query[queryIndex] === text[textIndex]) {
      score += 10 + consecutiveMatches;
      consecutiveMatches += 5;
      queryIndex++;
      textIndex++;
    } else {
      consecutiveMatches = 0;
      textIndex++;
    }
  }

  // Bonus for exact prefix match
  if (text.startsWith(query)) {
    score *= 2;
  }

  // Bonus for whole word match at start
  if (text.split(" ")[0]?.startsWith(query)) {
    score *= 1.5;
  }

  // Penalty if query not completed
  if (queryIndex < query.length) {
    score = 0;
  }

  return score;
}

/**
 * Get indices of matched characters for highlighting
 */
function getMatchIndices(query: string, text: string): number[] {
  const indices: number[] = [];
  let textIndex = 0;
  let queryIndex = 0;

  while (queryIndex < query.length && textIndex < text.length) {
    if (query[queryIndex] === text[textIndex]) {
      indices.push(textIndex);
      queryIndex++;
    }
    textIndex++;
  }

  return indices;
}
