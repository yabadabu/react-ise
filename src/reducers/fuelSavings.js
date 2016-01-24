import { SAVE_FUEL_SAVINGS
       , CALCULATE_FUEL_SAVINGS
       , SELECT_MAIN_SECTION
       , CHANGE_STATE_MEMBER
       } from '../constants/ActionTypes';
import calculator from '../businessLogic/fuelSavingsCalculator';
import dateHelper from '../businessLogic/dateHelper';
import objectAssign from 'object-assign';

const initialState = {
    newMpg: null,
    tradeMpg: null,
    newPpg: null,
    tradePpg: null,
    milesDriven: null,
    milesDrivenTimeframe: 'week',
    displayResults: false,
    dateModified: null,
    necessaryDataIsProvidedToCalculateSavings: false,
    savings: {
        monthly: 0,
        annual: 0,
        threeYear: 0
    },
    selectedMainSection: 'Piezas',
    menuMainSectionOpened: false
};

//IMPORTANT: Note that with Redux, state should NEVER be changed.
//State is considered immutable. Instead,
//create a copy of the state passed and set new values on the copy.
//Note that I'm using Object.assign to create a copy of current state
//and update values on the copy.
export default function fuelSavingsAppState(state = initialState, action) {
  //console.log( action );
	switch (action.type) {

		case SAVE_FUEL_SAVINGS:
			//in a real app we'd trigger an AJAX call here. For this example, just simulating a save by changing date modified.
			return objectAssign({}, state, { dateModified: dateHelper.getFormattedDateTime(new Date()) });

		case CALCULATE_FUEL_SAVINGS:
			let newState = objectAssign({}, state);
			newState[action.fieldName] = action.value;
			let calc = calculator();
			newState.necessaryDataIsProvidedToCalculateSavings = calc.necessaryDataIsProvidedToCalculateSavings(newState);
			newState.dateModified = dateHelper.getFormattedDateTime(new Date());

			if (newState.necessaryDataIsProvidedToCalculateSavings) {
				newState.savings = calc.calculateSavings(newState);
			}

			return newState;

    case SELECT_MAIN_SECTION:
      return objectAssign({}, state, { 
                  selectedMainSection: action.selectedMainSection
                , menuMainSectionOpened: false });

    case CHANGE_STATE_MEMBER:
      let newState2 = objectAssign({}, state);
      newState2[action.fieldName] = action.value;
      return newState2;

		default:
			return state;
	}
}
