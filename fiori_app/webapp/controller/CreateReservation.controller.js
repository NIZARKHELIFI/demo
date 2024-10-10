sap.ui.define([
  './BaseController',
  'sap/ui/model/json/JSONModel',
  "sap/ui/core/Fragment",
  'ns/reservationfiori/model/formatter',
  "ns/reservationfiori/job/AppConstants"
], function (BaseController, JSONModel, Fragment, formatter, AppConstants) {
  "use strict";

  return BaseController.extend("ns.reservationfiori.controller.CreateReservation", {
    formatter: formatter,
    onInit: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("createReservation").attachPatternMatched(this._onRouteMatched, this);


      this.demandeurModel = this.getOwnerComponent().getModel("demandeur");
      this.getView().setModel(this.demandeurModel, "demandeur");

      this.userInfoModel = this.getOwnerComponent().getModel("userInfo");
      this.getView().setModel(this.userInfoModel, "userInfo");

      this.oEventBus = this.getOwnerComponent().getEventBus();

    },

    _onRouteMatched: function (oEvent) {
      // pop over choose Applicant

      this.sRouteName = oEvent.getParameter("name");

      if ((this.sRouteName === "createReservation")) {

        if (!this.oDialog) {
          this.oDialog = this.loadFragment({
            name: "ns.reservationfiori.Fragment.CCMagasin",
            id: "CCMagasin",
            controller: this
          });
        }
        // Get Magasin Cedant
        var oMagasinCedantJobConfig = {
          jobId: AppConstants.Z_SEARCH_HELP_EVENT,
          successfn: this.fnMagasinCedantSuccess.bind(this),
          errorfn: this.fnMagasinCedantError.bind(this),
          finishEvent: AppConstants.RUN_JOB_EVENT,
          jobChannel: AppConstants.JOB_CHANNEL,
          fieldname: "magasinCedant"
        };

        this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oMagasinCedantJobConfig);

        // Get Cost Center
        var oCostCenterJobConfig = {
          jobId: AppConstants.Z_SEARCH_HELP_EVENT,
          successfn: this.fnCostCenterSuccess.bind(this),
          errorfn: this.fnCostCenterError.bind(this),
          finishEvent: AppConstants.RUN_JOB_EVENT,
          jobChannel: AppConstants.JOB_CHANNEL,
          fieldname: "costCenter," + this.userInfoModel.getProperty("/customAttributes/departement")
        };

        this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oCostCenterJobConfig);

        // this.getView().byId("id_cost_center").setValue(oData.results[0].Zlgobe)
        // Open pop up choose applicant
        var that = this;
        this.oDialog.then(function (oDialog) {
          that.getView().addDependent(oDialog);
          oDialog.open();
        });
      }
      /////////////////////////////////////////// To do later
      // var fragmentId = this.getView().createId("CCMagasin");
      // var costCenter = Fragment.byId(fragmentId, "id_cost_center").getSelectedKey();
      // var MagasinCedant = Fragment.byId(fragmentId, "id_store").getSelectedKey();
      // var btnConfirme = Fragment.byId(fragmentId, "id_btn_Confirme");
      // if ((costCenter === "") || (MagasinCedant === "")) {

      //   btnConfirme.setProperty("enabled", false);

      // }
      ////////////////////////////
    },



    fnMagasinCedantSuccess: function (oResponse) {
      var oData = oResponse.results;
      var magasinscedant = [];
      oData.forEach(({ Key, Value }) => {
        magasinscedant.push({ Key, Value }); // Directly push the new object
      });
      this.demandeurModel.setProperty("/magasinCedant", magasinscedant);
    },

    fnMagasinCedantError: function (oResponse, oError) {

    },

    fnCostCenterSuccess: function (oResponse) {
      var oData = oResponse.results;
      var costCenters = [];
      oData.forEach(({ Key, Value }) => {
        costCenters.push({ Key, Value }); // Directly push the new object
      });
      this.demandeurModel.setProperty("/costCenter", costCenters);

    },

    fnCostCenterError: function (oResponse, oError) {

    },

    onSuggestionCostCenterItemSelected: function (oEvent) {
      debugger
      var oSelectedItem = oEvent.getParameter("selectedItem");//.getBindingContext("demandeur").getObject();
      if (oSelectedItem) {
        var oItem = oSelectedItem.getBindingContext("demandeur").getObject();
        // this.selectedValue = oItem ? oItem.Value : "";
        var fragmentId = this.getView().createId("CCMagasin");
        var costCenter = Fragment.byId(fragmentId, "id_cost_center");
        costCenter.setValue(oItem.Value);
      }
    },

    onSuggestionmagasinCedantItemSelected: function (oEvent) {
      var oSelectedItem = oEvent.getParameter("selectedItem");
      if (oSelectedItem) {
        var oItem = oSelectedItem.getBindingContext("demandeur").getObject();
        var fragmentId = this.getView().createId("CCMagasin");
        var MagasinCedant = Fragment.byId(fragmentId, "id_store");
        MagasinCedant.setValue(oItem.Value);
      }
    },

    onPressCloseApplicantPage: function () {
      this.getRouter().navTo("home");
      this.oDialog.then(function (oDialog) {
        oDialog.close();
      })

    },
    onPressConfirmeApplicant: function () {
      var fragmentId = this.getView().createId("CCMagasin");
      var costCenter = Fragment.byId(fragmentId, "id_cost_center").getSelectedKey();
      var MagasinCedant = Fragment.byId(fragmentId, "id_store").getSelectedKey();
      var btnConfirme = Fragment.byId(fragmentId, "id_btn_Confirme");
      if ((costCenter === "") || (MagasinCedant === "")) {

        btnConfirme.setProperty("enabled", false);

      }
      this.oDialog.then(function (oDialog) {
        oDialog.close();
      })

      var oArticlesJobConfig = {
        jobId: AppConstants.Z_ARTICLES_EVENT,
        successfn: this.fnArticlesSuccess.bind(this),
        errorfn: this.fnArticlesError.bind(this),
        finishEvent: AppConstants.RUN_JOB_EVENT,
        jobChannel: AppConstants.JOB_CHANNEL,
        dept: this.userInfoModel.getProperty("/customAttributes/departement")
      };

      this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oArticlesJobConfig);

    },
    fnArticlesSuccess: function (oResponse) {debugger
      var that = this;
      var oModelArticles = new JSONModel();
      oModelArticles.setData(oResponse.results);
      oModelArticles.setSizeLimit(oResponse.results.length);
      that.getView().setModel(oModelArticles, "ArticlesModel");
    },

    fnArticlesError: function (oResponse, oError) {

    },
    onCodeArticleSuggestions: function (oEvent) {
      // Get Code Article
      var oCodeArticleJobConfig = {
        jobId: AppConstants.Z_SEARCH_HELP_EVENT,
        successfn: this.fnCodeArticleSuccess.bind(this),
        errorfn: this.fnCodeArticleError.bind(this),
        finishEvent: AppConstants.RUN_JOB_EVENT,
        jobChannel: AppConstants.JOB_CHANNEL,
        fieldname: "material"
      };

      this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oCodeArticleJobConfig);

    },
    fnCodeArticleSuccess: function (oResponse) {
      var that = this;
      var oModelCodeArticle = new JSONModel();
      oModelCodeArticle.setData(oResponse.results);
      oModelCodeArticle.setSizeLimit(oResponse.results.length);
      that.getView().setModel(oModelCodeArticle, "CodeArticleModel");
    },
    fnCodeArticleError: function (oResponse, oError) {

    },

    onSuggestionCodeArticleItemSelected: function (oEvent) {

    },

    // Get Groupe Marchandise
    onGroupeMarchandiseSuggestions: function (oEvent) {
      var oGroupeMarchandiseJobConfig = {
        jobId: AppConstants.Z_SEARCH_HELP_EVENT,
        successfn: this.fnGroupeMarchandiseSuccess.bind(this),
        errorfn: this.fnGroupeMarchandiseError.bind(this),
        finishEvent: AppConstants.RUN_JOB_EVENT,
        jobChannel: AppConstants.JOB_CHANNEL,
        fieldname: "materialGroup"
      };

      this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oGroupeMarchandiseJobConfig);

    },
    fnGroupeMarchandiseSuccess: function (oResponse) {
      var that = this;
      var oModelGroupeMarchandise = new JSONModel();
      oModelGroupeMarchandise.setData(oResponse.results);
      oModelGroupeMarchandise.setSizeLimit(oResponse.results.length);
      that.getView().setModel(oModelGroupeMarchandise, "GroupeMarchandiseModel");
    },

    fnGroupeMarchandiseError: function (oResponse, oError) {

    },
    // Get Ancien Code Article
    onAncienCodeArticleSuggestions: function (oEvent) {
      var oAncienCodeArticleJobConfig = {
        jobId: AppConstants.Z_SEARCH_HELP_EVENT,
        successfn: this.fnAncienCodeArticleSuccess.bind(this),
        errorfn: this.fnAncienCodeArticleError.bind(this),
        finishEvent: AppConstants.RUN_JOB_EVENT,
        jobChannel: AppConstants.JOB_CHANNEL,
        fieldname: "materialGroup" // To do later backend
      };

      this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oAncienCodeArticleJobConfig);

    },

    fnAncienCodeArticleSuccess: function (oResponse) {
      var that = this;
      var oModelAncienCodeArticle = new JSONModel();
      oModelAncienCodeArticle.setData(oResponse.results);
      oModelAncienCodeArticle.setSizeLimit(oResponse.results.length);
      that.getView().setModel(oModelAncienCodeArticle, "AncienCodeArticleModel");
    },

    fnAncienCodeArticleError: function (oResponse, oError) {

    },

        // Get Désignation Article
        onDesignationArticleSuggestions: function (oEvent) {
          var oDesignationArticleJobConfig = {
            jobId: AppConstants.Z_SEARCH_HELP_EVENT,
            successfn: this.fnDesignationArticleSuccess.bind(this),
            errorfn: this.fnADesignationArticleError.bind(this),
            finishEvent: AppConstants.RUN_JOB_EVENT,
            jobChannel: AppConstants.JOB_CHANNEL,
            fieldname: "materialDesignation"
          };
    
          this.oEventBus.publish(AppConstants.JOB_CHANNEL, AppConstants.RUN_JOB_EVENT, oDesignationArticleJobConfig);
    
        },

        fnDesignationArticleSuccess: function (oResponse) {
          var that = this;
          var oModelDesignationArticle = new JSONModel();
          oModelDesignationArticle.setData(oResponse.results);
          oModelDesignationArticle.setSizeLimit(oResponse.results.length);
          that.getView().setModel(oModelDesignationArticle, "DesignationArticleModel");
        },
    
        fnADesignationArticleError: function (oResponse, oError) {
    
        },
  });
});
