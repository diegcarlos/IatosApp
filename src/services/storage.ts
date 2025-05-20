import AsyncStorage from '@react-native-async-storage/async-storage';
import { SimulationResult } from '../types';

const HISTORY_KEY = '@IatrosApp:simulationHistory';

/**
 * Retrieves the simulation history from AsyncStorage.
 */
export const getHistory = async (): Promise<SimulationResult[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading history from AsyncStorage', e);
    return [];
  }
};

/**
 * Saves a new simulation result to the history in AsyncStorage.
 * Prepends the new result to the existing history.
 */
export const saveSimulation = async (newResult: Omit<SimulationResult, 'id' | 'date'>): Promise<void> => {
  try {
    const currentHistory = await getHistory();
    const simulationToAdd: SimulationResult = {
      ...newResult,
      id: Date.now().toString(), // Simple unique ID based on timestamp
      date: new Date().toISOString(), // Store date as ISO string
    };
    const updatedHistory = [simulationToAdd, ...currentHistory]; // Prepend new result
    const jsonValue = JSON.stringify(updatedHistory);
    await AsyncStorage.setItem(HISTORY_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving simulation to AsyncStorage', e);
  }
};

/**
 * Clears the entire simulation history from AsyncStorage.
 */
export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Error clearing history from AsyncStorage', e);
  }
};

