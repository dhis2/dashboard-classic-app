const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line
if( process.env.NODE_ENV !== 'production' ) {
  jQuery.ajaxSetup({headers: {Authorization: dhisDevConfig.authorization}}); // eslint-disable-line
}

import {init, config, getInstance, getManifest, getUserSettings} from 'd2/lib/d2';
import log from 'loglevel';
import dhis2 from 'd2-ui/lib/header-bar/dhis2';


function configI18n( userSettings ) {
  const uiLocale = userSettings.keyUiLocale;
  if( uiLocale && uiLocale !== 'en' ) {
    // Add the language sources for the preferred locale
    config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
  }
  // Add english as locale for all cases (either as primary or fallback)
  config.i18n.sources.add('./i18n/i18n_module_en.properties');
}

getManifest('./manifest.webapp')
    .then(manifest => {
      const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
      config.baseUrl = `${baseUrl}/api`;
      // Set the baseUrl to localhost if we are in dev mode
      if( process.env.NODE_ENV !== 'production' ) {
        dhis2.settings.baseUrl = baseUrl;
      }
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .catch(log.error.bind(log));


Ext.onReady(function(){
  getInstance()
      .then(d2 => { initTranslation(d2);})
      .then(() => loadScript("javascript/dashboard.js?_rev=2.26"))
});


jQuery(document).ready(function () {
  initPage();
});

function loadScript( url ) {

  return new Promise(function ( resolve, reject ) {
    let head = document.getElementsByTagName('head')[0];
    let scriptIndex = head.getElementsByTagName('script').length;
    let refScript = head.getElementsByTagName('script')[scriptIndex - 1];
    let script = document.createElement('script');
    script.src = url;
    script.async = false;
    script.type = 'text/javascript';
    script.addEventListener('load', function () {
      resolve(script);
    }, false);

    script.addEventListener('error', function () {
      reject(script);
    }, false);

    refScript.parentNode.insertBefore(script, refScript.nextSibling);
  });
}

const checkProfileFilled = function ( curUser ) {
  let props = [curUser.jobTitle, curUser.introduction, curUser.gender, curUser.birthday,
    curUser.nationality, curUser.employer, curUser.education, curUser.interests, curUser.languages];
  let count = 0;

  props.forEach(prop => {
    count = prop != null ? (count + 1) : count;
  });

  return count > 3;
}

function initPage() {

  getInstance().then(d2 => {

    const api = d2.Api.getApi();
    let unreadInterpretations;
    let unreadMessageConversations;
    let isProfileFilled;

    api.get("/me/dashboard", {})
        .then(data => {
          unreadInterpretations = data.unreadInterpretations;
          unreadMessageConversations = data.unreadMessageConversations;

          if( unreadMessageConversations > 0 ) {
            if( unreadMessageConversations > 1 ) {
              jQuery("#messageCount").html(unreadMessageConversations + " " + d2.i18n.getTranslation("unread_messages"));
            } else {
              jQuery("#messageCount").html(unreadMessageConversations + " " + d2.i18n.getTranslation("unread_message"));
            }
            jQuery("#messageCont").show();
          } else {
            jQuery("#messageCont").hide();
          }

          if( unreadInterpretations > 0 ) {
            if( unreadInterpretations > 1 ) {
              jQuery("#interpretationCount").html(unreadInterpretations + " " + d2.i18n.getTranslation("new_interpretations"));
            } else {
              jQuery("#interpretationCount").html(unreadInterpretations + " " + d2.i18n.getTranslation("new_interpretation"));
            }
            jQuery("#interpretationCount").show();
          } else {
            jQuery("#interpretationCount").hide();
          }

        });

    api.get("me", {})
        .then(data => {
          isProfileFilled = checkProfileFilled(data);
          if( !isProfileFilled ) {
            jQuery("#updateProfileCont").css("display", "inline");
          } else {
            jQuery("#updateProfileCont").hide();
          }
        });
  });
}


const initTranslation = function ( d2 ) {

  global.i18n_share_your_interpretation_of = d2.i18n.getTranslation("share_your_interpretation_of");
  global.i18n_interpretation_was_shared = d2.i18n.getTranslation("interpretation_was_shared");
  global.i18n_viewing = d2.i18n.getTranslation("viewing");
  global.i18n_click_add_new_to_get_started = d2.i18n.getTranslation("click_add_new_to_get_started");
  global.i18n_add_stuff_by_searching = d2.i18n.getTranslation("add_stuff_by_searching");
  global.i18n_arrange_dashboard_by_dragging_and_dropping = d2.i18n.getTranslation("arrange_dashboard_by_dragging_and_dropping");
  global.i18n_remove = d2.i18n.getTranslation("remove");
  global.i18n_view_full_size = d2.i18n.getTranslation("view_full_size");
  global.i18n_click_to_explore_drag_to_new_position = d2.i18n.getTranslation("click_to_explore_drag_to_new_position");
  global.i18n_drag_to_new_position = d2.i18n.getTranslation("drag_to_new_position");
  global.i18n_manage = d2.i18n.getTranslation("manage");
  global.i18n_share = d2.i18n.getTranslation("share");
  global.i18n_explore = d2.i18n.getTranslation("explore");
  global.i18n_resize = d2.i18n.getTranslation("resize");
  global.i18n_share_interpretation = d2.i18n.getTranslation("share_interpretation");
  global.i18n_see_more_hits = d2.i18n.getTranslation("see_more_hits");
  global.i18n_see_fewer_hits = d2.i18n.getTranslation("see_fewer_hits");
  global.i18n_add = d2.i18n.getTranslation("add");
  global.i18n_click_and_drag_to_new_position = d2.i18n.getTranslation("click_and_drag_to_new_position");
  global.i18n_get_as_image = d2.i18n.getTranslation("get_as_image");
  global.i18n_user_org_unit_filter = d2.i18n.getTranslation("user_org_unit_filter");
  global.i18n_applies_to_favorites_with_user_org_units_only = d2.i18n.getTranslation("applies_to_favorites_with_user_org_units_only");
  global.i18n_missing_dashboard_app = d2.i18n.getTranslation("missing_dashboard_app");
  global.i18n_update_profile = d2.i18n.getTranslation("update_profile");
  global.i18n_add_new_dashboard =  d2.i18n.getTranslation("add_new_dashboard");
  global.i18n_users = d2.i18n.getTranslation("users");
  global.i18n_event_charts = d2.i18n.getTranslation("event_charts");
  global.i18n_maps = d2.i18n.getTranslation("maps");
  global.i18n_event_reports = d2.i18n.getTranslation("event_reports");
  global.i18n_standard_reports = d2.i18n.getTranslation("standard_reports");
  global.i18n_resources = d2.i18n.getTranslation("resources");
  global.i18n_apps = d2.i18n.getTranslation("apps");
  global.i18n_share_your_data_interpretations = d2.i18n.getTranslation("share_your_data_intepretations");
  global.i18n_can_edit_and_view = d2.i18n.getTranslation("can_edit_and_view");
  global.i18n_can_view = d2.i18n.getTranslation("can_view");
  global.i18n_cancel = d2.i18n.getTranslation("cancel");
  global.i18n_save = d2.i18n.getTranslation("save");
  global.i18n_pivot_tables= d2.i18n.getTranslation("pivot_tables");
  global.i18n_no_results_found = d2.i18n.getTranslation("no_results_found");


  jQuery("#i18n_update_profile").html(d2.i18n.getTranslation("update_profile"));
  jQuery("#i18n_write_feedback").html(d2.i18n.getTranslation("write_feedback"));
  jQuery("#i18n_interpretations").html(d2.i18n.getTranslation("interpretations"));
  jQuery("#searchField").attr({"placeholder": d2.i18n.getTranslation("search_for_users_charts_maps_reports")});
  jQuery("#i18n_search").html(d2.i18n.getTranslation("search"));
  jQuery("#i18n_rename_current_dashboard").html(d2.i18n.getTranslation("rename_current_dashboard"));
  jQuery("label[name='i18n_from']").html(d2.i18n.getTranslation("from"));
  jQuery("#i18n_pivot_table").html(d2.i18n.getTranslation("pivot_table"));
  jQuery("#i18n_generate_pivot_table_click_share").html(d2.i18n.getTranslation("generate_pivot_table_click_share"));
  jQuery("#i18n_data_visualizer").html(d2.i18n.getTranslation("data_visualizer"));
  jQuery("label[name='i18n_load_favorite_click_share']").html(d2.i18n.getTranslation("load_favorite_click_share"));
  jQuery("#i18n_gis").html(d2.i18n.getTranslation("gis"));
  jQuery("#i18n_data_set_report").html(d2.i18n.getTranslation("data_set_report"));
  jQuery("#i18n_generate_data_set_report_click_share").html(d2.i18n.getTranslation("generate_data_set_report_click_share"));
  jQuery("[name='i18n_name']").html(d2.i18n.getTranslation("name"));
  jQuery("[name='i18n_create']").html(d2.i18n.getTranslation("create"));
  jQuery("[name='i18n_rename']").html(d2.i18n.getTranslation("rename"));
  jQuery("#i18n_add_items_to_current_dashboard").html(d2.i18n.getTranslation("add_items_to_current_dashboard"));
  jQuery("[name='i18n_messages']").html(d2.i18n.getTranslation("messages"));
  jQuery("[name='i18n_delete']").html(d2.i18n.getTranslation("delete"));
  jQuery("[name='i18n_translate']").html(d2.i18n.getTranslation("translate"));
  jQuery("#i18n_applies_to_favorites_with_user_org_units_only").html(d2.i18n.getTranslation("applies_to_favorites_with_user_org_units_only"));
  jQuery("[name='i18n_clear']").html(d2.i18n.getTranslation("clear"));
  jQuery("[name='i18n_update']").html(d2.i18n.getTranslation("update"));
  jQuery("[name='i18n_close']").html(d2.i18n.getTranslation("close"));
  jQuery("[name='i18n_manage']").html(d2.i18n.getTranslation("manage"));
  jQuery("[name='i18n_share']").html(d2.i18n.getTranslation("share"));
  jQuery("#headerBanner").attr({"title": d2.i18n.getTranslation("view_home_page")});
  jQuery("[name='i18n_show_menu']").html(d2.i18n.getTranslation("show_menu"));
  jQuery("#i18n_add").html(d2.i18n.getTranslation("add"));
  jQuery("#i18n_delete_current_dashboard").html(d2.i18n.getTranslation("delete_current_dashboard"));
  jQuery("#i18n_translate_current_dashboard").html(d2.i18n.getTranslation("translate_current_dashboard"));

  jQuery("#sharingSettings").attr({"title": d2.i18n.getTranslation("sharing_settings")});
  jQuery("#sharingSearch").attr({"placeholder": d2.i18n.getTranslation("search_for_user_groups")});
  jQuery("#i18n_created_by").html(d2.i18n.getTranslation("created_by") + ":");
  jQuery("#i18n_external_access").html(d2.i18n.getTranslation("external_access"));
  jQuery("#i18n_public_access").html(d2.i18n.getTranslation("public_access"));
  jQuery("[name='i18n_can_view']").html(d2.i18n.getTranslation("can_view"));
  jQuery("#i18n_none").html(d2.i18n.getTranslation("none"));
  jQuery("[name='i18n_can_edit_and_view']").html(d2.i18n.getTranslation("can_edit_and_view"));
  jQuery("#i18n_interpretations").html(d2.i18n.getTranslation("interpretations"));
  jQuery("[name='i18n_interpretations']").html(d2.i18n.getTranslation("interpretations"));
  jQuery("#interpretationArea").attr({"placeholder": d2.i18n.getTranslation("write_your_interpretation")});
  jQuery(".interpretationButton").val(d2.i18n.getTranslation("share"));

}




