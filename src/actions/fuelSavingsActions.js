import * as types from '../constants/ActionTypes';

export function saveFuelSavings(settings) {
	return { type: types.SAVE_FUEL_SAVINGS, settings };
}

export function calculateFuelSavings(settings, fieldName, value) {
	return { type: types.CALCULATE_FUEL_SAVINGS, settings, fieldName, value };
}

export function selectMainSection(new_section) {
  return { type: types.SELECT_MAIN_SECTION, selectedMainSection: new_section };
}

export function changeState(fieldName, value) {
  return { type: types.CHANGE_STATE_MEMBER, fieldName, value };
}