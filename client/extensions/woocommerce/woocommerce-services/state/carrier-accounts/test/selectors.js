/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { getCarrierAccountsState, getFormErrors, getFormValidState } from '../selectors';
import initialCarrierAccountsState from '../../../lib/initialize-carrier-accounts-state.js';

const siteId = 123;
const carrier = 'UPS';

const getState = ( carrierAccountsState = initialCarrierAccountsState() ) => {
	return {
		extensions: {
			woocommerce: {
				woocommerceServices: {
					[ siteId ]: {
						carrierAccounts: carrierAccountsState,
					},
				},
			},
		},
	};
};

describe( 'Carrier Accounts selectors', () => {
	test( 'getCarrierAccountsState returns the current state', () => {
		const state = getState();
		const result = getCarrierAccountsState( state, siteId, carrier );
		expect( result ).to.eql( {
			settings: {
				fieldErrors: {},
				ignoreValidation: {
					account_number: true,
					address: true,
					city: true,
					company_name: true,
					company_website: true,
					country: false,
					email: true,
					job_title: true,
					license_agreement: true,
					name: true,
					phone: true,
					postal_code: true,
					state: true,
				},
				requiredFields: [
					'account_number',
					'name',
					'address',
					'city',
					'state',
					'state',
					'country',
					'postal_code',
					'phone',
					'email',
					'company_name',
					'job_title',
					'company_website',
					'license_agreement',
				],
				showUPSInvoiceFields: false,
				values: { country: 'US' },
			},
		} );
	} );
	test( 'getFormErrors returns the settings screen form errors object', () => {
		const state = getState();
		const carrierAccountState = getCarrierAccountsState( state, siteId, carrier );
		const settings = carrierAccountState.settings;
		const { ignoreValidation, values } = settings;
		const newState = getState( {
			[ carrier ]: {
				settings: {
					...settings,
					values: {
						...values,
						account_number: null,
					},
					ignoreValidation: {
						...ignoreValidation,
						account_number: false,
					},
				},
			},
		} );

		const result = getFormErrors( newState, siteId, carrier );

		expect( result ).to.eql( { account_number: 'This field is required' } );
	} );
	test( 'getFormErrors validates if website url is invalid', () => {
		const state = getState();
		const carrierAccountState = getCarrierAccountsState( state, siteId, carrier );
		const settings = carrierAccountState.settings;
		const { ignoreValidation, values } = settings;
		const newState = getState( {
			[ carrier ]: {
				settings: {
					...settings,
					values: {
						...values,
						company_website: 'http://asdf',
					},
					ignoreValidation: {
						...ignoreValidation,
						company_website: false,
					},
				},
			},
		} );

		const result = getFormErrors( newState, siteId, carrier );

		expect( result ).to.eql( {
			company_website: 'The company website format is not valid',
		} );
	} );
	test( 'getFormErrors validates if email is invalid', () => {
		const state = getState();
		const carrierAccountState = getCarrierAccountsState( state, siteId, carrier );
		const settings = carrierAccountState.settings;
		const { ignoreValidation, values } = settings;
		const newState = getState( {
			[ carrier ]: {
				settings: {
					...settings,
					values: {
						...values,
						email: 'http://asdf',
					},
					ignoreValidation: {
						...ignoreValidation,
						email: false,
					},
				},
			},
		} );

		const result = getFormErrors( newState, siteId, carrier );

		expect( result ).to.eql( {
			email: 'The email format is not valid',
		} );
	} );

	test( 'getFormValidState tells us if the settings form is ok', () => {
		const state = getState();
		const carrierAccountState = getCarrierAccountsState( state, siteId, carrier );
		const { requiredFields } = carrierAccountState.settings;
		const ignoreValidation = requiredFields.reduce( ( accumulator, currentValue ) => {
			accumulator[ currentValue ] = false;
			return accumulator;
		}, {} );
		const settings = carrierAccountState.settings;
		const newState = getState( {
			[ carrier ]: {
				settings: {
					...settings,
					ignoreValidation,
				},
			},
		} );

		const result = getFormValidState( newState, siteId, carrier );

		expect( result ).to.eql( true );
	} );

	test( "getFormValidState is false if any field hasn't been validated", () => {
		const state = getState();
		const carrierAccountState = getCarrierAccountsState( state, siteId, carrier );
		const { requiredFields } = carrierAccountState.settings;
		const ignoreValidation = requiredFields.reduce( ( accumulator, currentValue ) => {
			accumulator[ currentValue ] = false;
			return accumulator;
		}, {} );
		const settings = carrierAccountState.settings;
		const newState = getState( {
			[ carrier ]: {
				settings: {
					...settings,
					ignoreValidation: {
						...ignoreValidation,
						account_number: true,
					},
				},
			},
		} );

		const result = getFormValidState( newState, siteId, carrier );

		expect( result ).to.eql( false );
	} );
} );
