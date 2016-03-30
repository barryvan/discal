window.discal = window.discal || {};
discal.config = {

	// Determines the minimum height of each entry rendered (in minutes).
	minimumLength: 45 * 60,

	// The maximum number of reccurrences to expand before stopping. This is
	// necessary as some rules may be infinite.
	maxExpansions: 365 * 2,

	// Whether or not to highlight "current" events
	highlightCurrent: true
};
