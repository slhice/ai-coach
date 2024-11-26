import { TutorConfig } from '../types';

export const loadSubjectConfig = async (subject: string): Promise<TutorConfig> => {
  try {
    const config = await import(`../config/subjects/${subject}.json`);
    return {
      ...config,
      materials: config.materials.map((m: any) => ({
        title: m.title,
        content: m.content,
        topics: m.topics,
        moduleNumber: m.moduleNumber
      }))
    };
  } catch (error) {
    console.error(`Error loading ${subject} configuration:`, error);
    throw new Error(`Failed to load configuration for ${subject}`);
  }
};

export const getAvailableSubjects = async (): Promise<string[]> => {
  try {
    const subjects = await import.meta.glob('../config/subjects/*.json');
    return Object.keys(subjects).map(path => 
      path.split('/').pop()?.replace('.json', '') || ''
    );
  } catch (error) {
    console.error('Error loading subjects:', error);
    return [];
  }
};