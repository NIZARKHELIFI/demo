sap.ui.define([
	"sap/base/strings/formatMessage"
], function (formatMessage) {
	"use strict";

	return {
		formatMessage: formatMessage,

		/**
		 * Determines the path of the image depending if its a phone or not the smaller or larger image version is loaded
		 *
		 * @public
		 * @param {boolean} bIsPhone the value to be checked
		 * @param {string} sImagePath The path of the image
		 * @returns {string} path to image
		 */
		addDelegate: function (v) {
			// if (v !== null) {
			// }
			return v;

		},

		getCostCenterStatus: function(sDept){
			// var oComboBox = sap.ui.core.Fragment.byId("CCMagasin", "id_cost_center");
			// sDept === "G01" ? oComboBox.setSelectedKey("interne"): "";
			// return sDept === "G01" ? false : true;
			return true;

		},
		getClient: function (sClientType, sMatr, sCin) {
			if (sClientType === "X") {
				return "CIN :" + sCin;
			} else {
				return "MF :" + sMatr;
			}
		},
		getTotalTTC: function (aValues) {
			var iSum = 0;
			$.each(aValues, function (k, oValue) {
				iSum += parseInt(oValue.quantity) * parseInt(oValue.prixTTC);
			});
			return iSum;
		},
		getTotalHT: function (aValues) {
			var iSum = 0;
			$.each(aValues, function (k, oValue) {
				iSum += parseInt(oValue.quantity) * parseInt(oValue.prixHT);
			});
			return iSum;

		},
		getTotal: function (iValue, iQuantity) {
			return parseInt(iValue) * parseInt(iQuantity);
		},
		getDate: function (iValue) {
			var dt = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd/MM/yyyy"
			});
			if (parseInt(iValue) === 0 || iValue === "" || iValue === undefined || iValue === null) {
				return "N/A";
			} else {
				return dt.format(iValue);
			}

		},
		getDateCar: function (iValue) {
			var dt = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "d, MMM , yyyy"
			});
			if (parseInt(iValue) === 0 || iValue === "" || iValue === undefined || iValue === null) {
				return "N/A";
			} else {
				return dt.format(iValue);
			}

		},
		getCartLength: function (iValue) {
			return parseInt(iValue);
		},
		getValueVide: function (iValue) {
			if (parseInt(iValue) === 0 || iValue === "" || iValue === undefined || iValue === null) {
				return "N/A";
			} else {
				return iValue;
			}
		},
		getDepStatus: function (iValue) {
			if (parseInt(iValue) < 0) {
				return "Error";
			} else {
				return "Success";
			}
		},
		getStatut: function (iValue) {
			if (iValue === 'Bloqué') {
				return "Error";
			} else {
				return "Success";
			}
		},
		getValueStock: function (iValue) {
			if (iValue === "" || iValue === undefined || iValue === null || parseInt(iValue) === 0) {
				return "N/A";
			} else {
				return iValue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ',');
			}
		},
		getValueMaterials: function (iValue) {
			if (iValue === "" || iValue === undefined || iValue === null) {
				return "N/A";
			} else {
				return iValue.replace(".", ",");
			}
		},
		getValueMarge: function (iValue) {
			if (iValue === "" || iValue === undefined || iValue === null) {
				return "N/A";
			} else {
				return iValue.replace(".", ",") + " %";
			}
		},
		getPriceValue: function (iValue) {
			if (iValue === "" || iValue === undefined || iValue === null) {
				return "N/A";
			} else {
				return iValue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ',');
			}
		},
		//--Status Order Formatters--//
		getTitle: function (iMode, iCmd, iCmdSap) {
			switch (iMode) {
			case "disp":
				if (iCmdSap === "" || iCmdSap === undefined) {
					return "Commande № : " + iCmd;
				} else {
					return "Commande SAP № : " + iCmdSap;
				}
			case "editP":
				return "Panier";
			case "edit":
				if (iCmdSap === "" || iCmdSap === undefined) {
					return "Commande № : " + iCmd;
				} else {
					return "Commande SAP № : " + iCmdSap;
				}
			case "saisieOrd":
				return "Saisie Commande ";
			case "stCmd":
				if (iCmdSap === "" || iCmdSap === undefined) {
					return "Commande № : " + iCmd;
				} else {
					return "Commande SAP № : " + iCmdSap;
				}
			default:
				return "Panier";
			}

		},
		getIconForList: function (iValue) {
			if (iValue === "X") {
				return "sap-icon://information";
			} else if (iValue === "") {
				return "sap-icon://action-settings";
			} else {
				return "sap-icon://information";
			}

		},
		getNumeroCMD: function (iCmd, iCmdSap) {
			if (iCmdSap === "" || iCmdSap === undefined) {
				return iCmd;
			} else {
				return iCmdSap;
			}
		},
		getRegDiscount: function (icmsp, icmdreg, ipostereg) {
			if (icmsp === "" || icmsp === undefined) {
				if (ipostereg === undefined) {
					return "0,000 %";
				} else {
					return ipostereg.replace('.', ',') + " %";
				}
			} else {
				if (icmdreg === undefined) {
					return "0,000 %";
				} else {
					return icmdreg.replace('.', ',') + " %";
				}
			}
		},
		//Formatter for Cancel button enability
		cancelFormatter: function (iStatus) {
			if (iStatus === "01" || iStatus === "10" || iStatus === "11") {
				return true;

			} else {
				return false;
			}

		},

		//Formatter for Edit button enability
		editFormatter: function (iStatus, iRole) {

			if (iStatus === "01" || iStatus === "10" || iStatus === "11") {
				return true;
			} else {
				if (iRole === "X" && ( iStatus === "07" || iStatus === "02" )) { // Admin can modify confirmed orders
					return true;
				} else {
					return false;
				}
			}

		},

		//--Formatter for status icon
		statusIconFormatter: function (sValue) {
			var sIconName = "";
			switch (sValue) {
			case "01": //Sauvegardée
				sIconName = "sap-icon://save";
				break;
			case "02": //Validée
				sIconName = "sap-icon://sys-enter";
				break;
			case "03": //Préparation & CTR
				sIconName = "sap-icon://donut-chart";
				break;
			case "04": //Attente livraison
				sIconName = "sap-icon://activity-items";
				break;
			case "05": //Livraison en cours
				sIconName = "sap-icon://shipping-status";
				break;
			case "06": //Livraison partielle
				sIconName = "sap-icon://pending";
				break;
			case "07": //Bloquée
				sIconName = "sap-icon://stop";
				break;
			case "08": //Livraison conforme
				sIconName = "sap-icon://BusinessSuiteInAppSymbols/icon-keep-segment";
				break;
			case "09": //Livraison réclam
				sIconName = "sap-icon://SAP-icons-TNT/exceptions";
				break;
			case "10": //Devis
				//    sIconName = 'sap-icon://sales-quote';
				sIconName = "sap-icon://sales-order-item";
				break;
			case "11": //Annulée
				sIconName = "sap-icon://cancel";
				break;
			case "12": //Brouillon
				sIconName = "sap-icon://SAP-icons-TNT/status-suspending";
				break;
			case "13": //Réclamation traitée
				sIconName = "sap-icon://approvals";
				break;
			default:
				sIconName = "sap-icon://incident";
			}
			return sIconName;
		},

		//--Formatter for status tooltip
		statusTooltipFormatter: function (sValue) {
			var sTooltip = "";
			switch (sValue) {
			case "01": //Sauvegardée
				sTooltip = "Sauvegardée"; //this.getResourceBundle().getText("sauvegardée");
				break;
			case "02": //Validée
				sTooltip = "Validée"; //this.getResourceBundle().getText("validée");
				break;
			case "03": //Préparation & CTR
				sTooltip = "Préparation & CTR"; //this.getResourceBundle().getText("préparation & ctr");
				break;
			case "04": //Attente livraison
				sTooltip = "Attente livraison"; //this.getResourceBundle().getText("attente livraison");
				break;
			case "05": //Livraison en cours
				sTooltip = "Livraison en cours"; //this.getResourceBundle().getText("livraison en cours");
				break;
			case "06": //Livraison partielle
				sTooltip = "Liv. partielle";
				break;
			case "07": //Bloquée
				sTooltip = "Bloquée"; //this.getResourceBundle().getText("bloquée");
				break;
			case "08": //Livraison conforme
				sTooltip = "Livrée conforme";
				break;
			case "09": //Livraison réclam
				sTooltip = "Livrée réclam";
				break;
			case "10": //Devis
				sTooltip = "Devis"; //this.getResourceBundle().getText("devis");
				break;
			case "11": //Annulée
				sTooltip = "Annulée"; //this.getResourceBundle().getText("annulée");
				break;
			case "12": //Brouillon
				sTooltip = "Brouillon"; //this.getResourceBundle().getText("brouillon");
				break;
			case "13": //Réclamation traitée
				sTooltip = "Réclamation traitée"; //this.getResourceBundle().getText("brouillon");
				break;
			}
			return sTooltip;

		},
		//--Formatter for icon color
		iconColorsFormatter: function (sValue) {
			var sIconColor = "";
			switch (sValue) {
			case "01": //Sauvegardée
				sIconColor = "#000080";
				break;
			case "02": //Validée
				sIconColor = "#008000";
				break;
			case "03": //Préparation & CTR
				sIconColor = "#000080";
				break;
			case "04": //Attente livraison
				sIconColor = "#f5a329";
				break;
			case "05": //Livraison en cours
				sIconColor = "#000080";
				break;
			case "07": //Bloquée
				sIconColor = "#DC143C";
				break;
			case "08": //Livraison conforme
				sIconColor = "#38d510";
				break;
			case "09": //Livraison réclam
				sIconColor = "#DC143C";
				break;
			case "10": //Devis
				sIconColor = "#8752a7";
				break;
			case "11": //Annulée
				sIconColor = "#DC143C";
				break;
			case "12": //Brouillon
				sIconColor = "#BFBFBF";
				break;
			case "13": //Réclamation traitée
				sIconColor = "#FAF31E";
				break;
			}
			return sIconColor;
		},
		//--Formatter for status tooltip
		carouselStatusFormatter: function (bValue) {
			var sIconSrc = "";
			if (bValue) {
				sIconSrc = "sap-icon://circle-task-2"; //Vert
				//this.$().find('.sapUiIcon').addClass('greenIcon');
			} else {
				sIconSrc = "sap-icon://circle-task"; //Rouge
				//this.$().find('.sapUiIcon').addClass('redIcon');
			}
			return sIconSrc;
		},
		carouselColorFormatter: function (bValue) {
			var sIconSrc = "";
			if (bValue) {
				sIconSrc = "greenIcon";
			} else {
				sIconSrc = "redIcon";
			}
			return sIconSrc;
		}

	};
}, true);