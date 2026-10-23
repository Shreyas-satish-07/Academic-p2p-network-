import { INITIAL_DISCUSSIONS } from './discussionsData';
export const TRENDING_DISCUSSIONS = INITIAL_DISCUSSIONS.filter(d => d.trending === true);
