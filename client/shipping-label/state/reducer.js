import {
	OPEN_PRINTING_FLOW,
	EXIT_PRINTING_FLOW,
	TOGGLE_STEP,
	UPDATE_ADDRESS_VALUE,
	ADDRESS_NORMALIZATION_IN_PROGRESS,
	ADDRESS_NORMALIZATION_COMPLETED,
	SELECT_NORMALIZED_ADDRESS,
	EDIT_ADDRESS,
	UPDATE_PACKAGE_WEIGHT,
	UPDATE_RATE,
	PURCHASE_LABEL_REQUEST,
	PURCHASE_LABEL_RESPONSE,
} from './actions';

const reducers = {};

reducers[ OPEN_PRINTING_FLOW ] = ( state ) => {
	return { ...state,
		showDialog: true,
	};
};

reducers[ EXIT_PRINTING_FLOW ] = ( state ) => {
	return { ...state,
		showDialog: false,
	};
};

reducers[ TOGGLE_STEP ] = ( state, { stepName } ) => {
	return { ...state,
		form: { ...state.form,
			[ stepName ]: { ...state.form[ stepName ],
				expanded: ! state.form[ stepName ].expanded,
			},
		},
	};
};

reducers[ UPDATE_ADDRESS_VALUE ] = ( state, { group, name, value } ) => {
	const newState = { ...state,
		form: { ...state.form,
			[ group ]: { ...state.form[ group ],
				values: { ...state.form[ group ].values,
					[ name ]: value,
				},
				isNormalized: false,
				normalized: null,
			},
		},
	};
	if ( 'country' === name ) {
		return reducers[ UPDATE_ADDRESS_VALUE ]( newState, { group, name: 'state', value: '' } );
	}
	return newState;
};

reducers[ ADDRESS_NORMALIZATION_IN_PROGRESS ] = ( state, { group } ) => {
	return { ...state,
		form: { ...state.form,
			[ group ]: { ...state.form[ group ],
				normalizationInProgress: true,
			},
		},
	};
};

reducers[ ADDRESS_NORMALIZATION_COMPLETED ] = ( state, { group, normalized } ) => {
	return { ...state,
		form: { ...state.form,
			[ group ]: { ...state.form[ group ],
				normalizationInProgress: false,
				isNormalized: true,
				selectNormalized: true,
				normalized,
			},
		},
	};
};

reducers[ SELECT_NORMALIZED_ADDRESS ] = ( state, { group, selectNormalized } ) => {
	return { ...state,
		form: { ...state.form,
			[ group ]: { ...state.form[ group ],
				selectNormalized,
			},
		},
	};
};

reducers[ EDIT_ADDRESS ] = ( state, { group } ) => {
	return { ...state,
		form: { ...state.form,
			[ group ]: { ...state.form[ group ],
				selectNormalized: false,
				normalized: null,
				isNormalized: false,
			},
		},
	};
};

reducers[ UPDATE_PACKAGE_WEIGHT ] = ( state, { packageIndex, value } ) => {
	const newPackages = [ ...state.form.packages.values ];
	newPackages[ packageIndex ] = { ...newPackages[ packageIndex ],
		weight: parseFloat( value ),
	};
	return { ...state,
		form: { ...state.form,
			packages: { ...state.form.packages,
				values: newPackages,
			},
		},
	};
};

reducers[ UPDATE_RATE ] = ( state, { packageIndex, value } ) => {
	const newRates = [ ...state.form.rates.values ];
	newRates[ packageIndex ] = value;
	return { ...state,
		form: { ...state.form,
			rates: { ...state.form.rates,
				values: newRates,
			},
		},
	};
};

reducers[ PURCHASE_LABEL_REQUEST ] = ( state ) => {
	return { ...state,
		form: { ...state.form,
			isSubmitting: true,
		},
	};
};

reducers[ PURCHASE_LABEL_RESPONSE ] = ( state, { response, error } ) => {
	const newState = { ...state,
		form: { ...state.form,
			isSubmitting: false,
		},
	};
	if ( ! error ) {
		newState.labels = response;
		newState.showDialog = false;
	}
	return newState;
};

export default ( state = {}, action ) => {
	if ( reducers[ action.type ] ) {
		return reducers[ action.type ]( state, action );
	}
	return state;
};
