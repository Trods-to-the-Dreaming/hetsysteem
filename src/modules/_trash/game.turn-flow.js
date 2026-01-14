export const ACTION_PAGES = [
	{
		key: 'customizeCharacter',
		url: '/game/turn/customize-character',
		isRelevant: turnData => !turnData.isCharacterCustomized
	},
	{
		key: 'manageBuildings',
		url: '/game/turn/manage-buildings',
		isRelevant: () => true
	},
	{
		key: 'manageEmploymentContracts',
		url: '/game/turn/manage-employment-contracts',
		isRelevant: () => true
	},
	{
		key: 'manageRentalAgreements',
		url: '/game/turn/manage-rental-agreements',
		isRelevant: () => true
	},
	{
		key: 'produce',
		url: '/game/turn/produce',
		isRelevant: () => true
	},
	{
		key: 'trade',
		url: '/game/turn/trade',
		isRelevant: () => true
	},
	{
		key: 'share',
		url: '/game/turn/share',
		isRelevant: () => true
	},
	{
		key: 'consume',
		url: '/game/turn/consume',
		isRelevant: () => true
	},
	{
		key: 'manageGroup',
		url: '/game/turn/manage-group',
		isRelevant: () => true
	}
];