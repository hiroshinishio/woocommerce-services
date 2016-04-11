import React from 'react';
import FormSectionHeading from 'components/forms/form-section-heading';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormButton from 'components/forms/form-button';
import FormCheckbox from 'components/forms/form-checkbox';
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormInputValidation from 'components/forms/form-input-validation';
import CompactCard from 'components/card/compact';
import SelectOptGroups from 'components/forms/select-opt-groups';

class AddPackageDialog extends React.Component {

	getPackageTypeOptions() {

		const { packageTypes } = this.props;

		const defaultTypesGroup = {
			label: 'Custom box',
			options: [
				{
					value: 'box',
					label: 'Box',
				},
				{
					value: 'envelope',
					label: 'Envelope',
				},
			],
		};

		const customTypes = Object.keys( packageTypes ).map( groupName => {
			const group = packageTypes[ groupName ];
			return {
				label: group.label,
				options: group.packages.map( groupPackage => ( {
					value: groupPackage.id,
					label: groupPackage.name,
				} ) ),
			}
		} );

		return [
			defaultTypesGroup,
			...customTypes
		];

	}

	render() {
		return (
			<div className="wcc-shipping-add-package">
				<CompactCard>
					<FormSectionHeading>Add a package</FormSectionHeading>
					<FormFieldset>
						<FormLabel htmlFor="package_type">Type of package</FormLabel>
						<SelectOptGroups id="package_type" value="box" optGroups={ this.getPackageTypeOptions() } readOnly={ true } />
					</FormFieldset>
					<FormFieldset>
						<FormLabel htmlFor="package_name">Package name</FormLabel>
						<FormTextInput
							id="package_name"
							name="package_name"
							className="is-error"
							placeholder="The customer will see this during checkout" />
						<FormInputValidation isError text="A package name is needed" />
					</FormFieldset>
					<FormFieldset>
						<FormLabel>Inner Dimensions (L x W x H)</FormLabel>
						<FormTextInput placeholder="100 x 25 x 5.5" />
						<a href="#">Define exterior dimensions</a>
					</FormFieldset>
					<FormFieldset>
						<div className="wcc-shipping-add-package-weight">
							<FormLabel htmlFor="package_weight">Package weight</FormLabel>
							<FormTextInput id="package_weight" name="package_weight" placeholder="Weight of box" />
						</div>
						<div className="wcc-shipping-add-package-weight">
							<FormLabel htmlFor="max_weight">Max weight</FormLabel>
							<FormTextInput id="max_weight" name="max_weight" placeholder="Max weight" /> lbs
						</div>
						<FormSettingExplanation>Define both the weight of the empty box and the max weight it can hold</FormSettingExplanation>
					</FormFieldset>
				</CompactCard>
				<CompactCard>
					<FormLabel>
						<FormCheckbox checked={ true } readOnly={ true } />
						<span>Save package to use in other shipping methods</span>
					</FormLabel>
					<FormButtonsBar>
						<FormButton>Add package</FormButton>
					</FormButtonsBar>
				</CompactCard>
			</div>
		);
	}

}

export default AddPackageDialog;
