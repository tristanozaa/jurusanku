import { JURUSAN_DATA } from '../data/constants';
import { MAJOR_RECOMMENDATIONS_DATA } from '../data/recommendationData';
import { Jurusan } from '../types';

interface RecommendationResult {
  recommendedMajors: Jurusan[];
}

/**
 * This is our core non-AI recommendation logic.
 * It takes a user's RIASEC scores and returns recommended majors.
 * @param scores - The user's RIASEC scores object.
 * @returns An object containing recommended majors.
 */
export const getRecommendations = (scores: { [key: string]: number }): RecommendationResult => {
  // Get major recommendations based on the single highest score
  const topScoreKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  const recommendedMajorIds = MAJOR_RECOMMENDATIONS_DATA[topScoreKey] || [];
  const recommendedMajors = JURUSAN_DATA.filter(jurusan => 
    recommendedMajorIds.includes(jurusan.id)
  );

  return {
    recommendedMajors,
  };
};
