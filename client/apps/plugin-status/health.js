/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { ExternalLink } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Indicator from './indicator';
import WooCommerceServicesIndicator from './woocommerce-services-indicator';
import SettingsGroupCard from 'woocommerce/woocommerce-services/components/settings-group-card';
import FormSettingExplanation from 'components/forms/form-setting-explanation';

const HealthView = ( { translate, healthItems, isShippingLoaded } ) => {
	return (
		<SettingsGroupCard heading={translate('Health', {
			context: 'This section displays the overall health of WooCommerce Shipping & Tax and the things it depends on',
		})}>
			<Indicator
				title={translate('WooCommerce')}
				message={healthItems.woocommerce.message}
				state={healthItems.woocommerce.state}
			/>
			<Indicator
				title={translate('WordPress.com Connection')}
				state={healthItems.wpcom_connection.state}
				message={healthItems.wpcom_connection.message}
			/>
			<Indicator
				title={translate('Automated Taxes')}
				state={healthItems.automated_taxes.state}
				message={healthItems.automated_taxes.message}
			>
				<FormSettingExplanation>
					{'tax' === healthItems.automated_taxes.settings_link_type && (
						<>
							<ExternalLink
								href="admin.php?page=wc-settings&tab=tax"
							>
								{translate('Go to the Tax settings')}
							</ExternalLink>
							<br/>
						</>
					)}
					{'general' === healthItems.automated_taxes.settings_link_type && (
						<>
							<ExternalLink
								href="admin.php?page=wc-settings"
							>
								{translate('Go to General settings')}
							</ExternalLink>
							<br/>
						</>
					)}
					<ExternalLink
						href="https://docs.woocommerce.com/document/woocommerce-shipping-and-tax/woocommerce-tax/"
					>
						{translate('Automated taxes documentation')}
					</ExternalLink>
				</FormSettingExplanation>
			</Indicator>

			{ isShippingLoaded && <WooCommerceServicesIndicator/> }
		</SettingsGroupCard>

	);
};

export default connect(
	( state ) => ( {
		healthItems: state.status.health_items,
		isShippingLoaded: state.status.is_shipping_loaded
	} )
)( localize( HealthView ) );
