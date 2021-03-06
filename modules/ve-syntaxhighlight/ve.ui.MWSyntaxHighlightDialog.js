/*!
 * VisualEditor UserInterface MWSyntaxHighlightDialog class.
 *
 * @copyright 2011-2015 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * MediaWiki syntax highlight dialog.
 *
 * @class
 * @extends ve.ui.MWExtensionDialog
 * @mixins ve.ui.MWSyntaxHighlightWindow
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.MWSyntaxHighlightDialog = function VeUiMWSyntaxHighlightDialog() {
	// Parent constructor
	ve.ui.MWSyntaxHighlightDialog.super.apply( this, arguments );

	// Mixin constructor
	ve.ui.MWSyntaxHighlightWindow.call( this );
};

/* Inheritance */

OO.inheritClass( ve.ui.MWSyntaxHighlightDialog, ve.ui.MWExtensionDialog );

OO.mixinClass( ve.ui.MWSyntaxHighlightDialog, ve.ui.MWSyntaxHighlightWindow );

/* Static properties */

ve.ui.MWSyntaxHighlightDialog.static.name = 'syntaxhighlightDialog';

ve.ui.MWSyntaxHighlightDialog.static.size = 'larger';

ve.ui.MWSyntaxHighlightDialog.static.modelClasses = [ ve.dm.MWBlockSyntaxHighlightNode ];

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.MWSyntaxHighlightDialog.prototype.initialize = function () {
	// Parent method
	ve.ui.MWSyntaxHighlightDialog.super.prototype.initialize.call( this );

	this.input = new ve.ui.MWAceEditorWidget( {
		limit: 1,
		multiline: true,
		rows: 10,
		maxRows: 25,
		autosize: true,
		classes: [ 've-ui-mwExtensionWindow-input' ]
	} );

	this.input.connect( this, { resize: 'updateSize' } );

	// Mixin method
	ve.ui.MWSyntaxHighlightWindow.prototype.initialize.call( this );

	this.showLinesCheckbox.connect( this, { change: 'onShowLinesCheckboxChange' } );

	this.languageField.setAlignment( 'left' );

	this.contentLayout = new OO.ui.PanelLayout( {
		scrollable: true,
		padded: true,
		expanded: false,
		content: [
			this.languageField,
			this.codeField,
			this.showLinesField
		]
	} );

	// Initialization
	this.$content.addClass( 've-ui-mwSyntaxHighlightDialog-content' );
	this.$body.append( this.contentLayout.$element );
};

/**
 * @inheritdoc MWSyntaxHighlightWindow
 */
ve.ui.MWSyntaxHighlightDialog.prototype.onLanguageInputChange = function () {
	var dialog = this;

	// Mixin method
	ve.ui.MWSyntaxHighlightWindow.prototype.onLanguageInputChange.call( this );

	this.language.getInput().isValid().done( function ( valid ) {
		dialog.input.setLanguage( valid ? dialog.language.getInput().getValue() : 'text' );
	} );
};

/**
 * Handle change events from the show lines chechbox
 *
 * @param {boolean} value Widget value
 */
ve.ui.MWSyntaxHighlightDialog.prototype.onShowLinesCheckboxChange = function () {
	this.input.toggleLineNumbers( this.showLinesCheckbox.isSelected() );
};

/**
 * @inheritdoc
 */
ve.ui.MWSyntaxHighlightDialog.prototype.getReadyProcess = function ( data ) {
	// Parent process
	var process = ve.ui.MWSyntaxHighlightDialog.super.prototype.getReadyProcess.call( this, data );
	// Mixin process
	return ve.ui.MWSyntaxHighlightWindow.prototype.getReadyProcess.call( this, data, process );
};

/**
 * @inheritdoc
 */
ve.ui.MWSyntaxHighlightDialog.prototype.getSetupProcess = function ( data ) {
	// Parent process
	var process = ve.ui.MWSyntaxHighlightDialog.super.prototype.getSetupProcess.call( this, data );
	// Mixin process
	return ve.ui.MWSyntaxHighlightWindow.prototype.getSetupProcess.call( this, data, process )
		.first( function () {
			this.input.setup();
		}, this )
		.next( function () {
			this.onShowLinesCheckboxChange();
			this.input.clearUndoStack();
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.MWSyntaxHighlightDialog.prototype.getTeardownProcess = function ( data ) {
	// Parent process
	var process = ve.ui.MWSyntaxHighlightDialog.super.prototype.getTeardownProcess.call( this, data );
	// Mixin process
	return ve.ui.MWSyntaxHighlightWindow.prototype.getTeardownProcess.call( this, data, process ).first( function () {
		this.language.input.setValue( '' );
		this.input.teardown();
	}, this );
};

/**
 * @inheritdoc
 */
ve.ui.MWSyntaxHighlightDialog.prototype.updateMwData = function () {
	// Parent method
	ve.ui.MWSyntaxHighlightDialog.super.prototype.updateMwData.apply( this, arguments );
	// Mixin method
	ve.ui.MWSyntaxHighlightWindow.prototype.updateMwData.apply( this, arguments );
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.MWSyntaxHighlightDialog );
